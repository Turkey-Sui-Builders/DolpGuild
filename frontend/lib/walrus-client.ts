/**
 * DolpGuild V3 - Walrus Storage Client
 * 
 * Utilities for uploading and downloading files from Walrus decentralized storage
 */

import { WALRUS_CONFIG } from "./constants"

export interface WalrusUploadResponse {
  blobId: string
  suiObjectId: string
  size: number
  encodedSize: number
  cost: string
  expiryEpoch: number
}

export interface WalrusUploadOptions {
  epochs?: number
  deletable?: boolean
}

/**
 * Upload a file to Walrus storage
 * 
 * @param file - File to upload
 * @param options - Upload options (epochs, deletable)
 * @returns Upload response with blob ID
 */
export async function uploadToWalrus(
  file: File,
  options: WalrusUploadOptions = {}
): Promise<WalrusUploadResponse> {
  const { epochs = 5, deletable = true } = options

  try {
    // Walrus HTTP API endpoint (v1/blobs according to docs)
    const url = `${WALRUS_CONFIG.PUBLISHER_URL}/v1/blobs?epochs=${epochs}`

    const response = await fetch(url, {
      method: "PUT",
      body: file,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Walrus upload failed (${response.status}): ${errorText}`)
    }

    const data = await response.json()

    console.log("🐋 Walrus API Response:", data)

    // Parse Walrus response
    if (data.newlyCreated) {
      const result = {
        blobId: data.newlyCreated.blobObject.blobId,
        suiObjectId: data.newlyCreated.blobObject.id,
        size: data.newlyCreated.blobObject.size,
        encodedSize: data.newlyCreated.blobObject.encodedSize,
        cost: data.newlyCreated.cost || "0",
        expiryEpoch: data.newlyCreated.endEpoch,
      }
      console.log("✅ Walrus blob created:", result)
      return result
    } else if (data.alreadyCertified) {
      const result = {
        blobId: data.alreadyCertified.blobId,
        suiObjectId: data.alreadyCertified.blobId, // Use blobId as fallback
        size: 0,
        encodedSize: 0,
        cost: "0",
        expiryEpoch: data.alreadyCertified.endEpoch,
      }
      console.log("✅ Walrus blob already certified:", result)
      return result
    }

    throw new Error("Unexpected Walrus response format")
  } catch (error) {
    console.error("Walrus upload error:", error)
    throw error
  }
}

/**
 * Download a file from Walrus storage
 * 
 * @param blobId - Blob ID to download
 * @returns Blob data
 */
export async function downloadFromWalrus(blobId: string): Promise<Blob> {
  try {
    const url = `${WALRUS_CONFIG.AGGREGATOR_URL}/v1/${blobId}`
    
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Walrus download failed: ${response.statusText}`)
    }

    return await response.blob()
  } catch (error) {
    console.error("Walrus download error:", error)
    throw error
  }
}

/**
 * Get Walrus blob URL for direct access
 * 
 * @param blobId - Blob ID
 * @returns URL to access the blob
 */
export function getWalrusBlobUrl(blobId: string): string {
  return `${WALRUS_CONFIG.AGGREGATOR_URL}/v1/${blobId}`
}

/**
 * Check if a blob exists on Walrus
 * 
 * @param blobId - Blob ID to check
 * @returns True if blob exists
 */
export async function checkWalrusBlobExists(blobId: string): Promise<boolean> {
  try {
    const url = `${WALRUS_CONFIG.AGGREGATOR_URL}/v1/${blobId}`
    
    const response = await fetch(url, { method: "HEAD" })
    
    return response.ok
  } catch (error) {
    console.error("Walrus blob check error:", error)
    return false
  }
}

/**
 * Upload CV to Walrus and return blob ID
 * Helper function specifically for CV uploads
 *
 * @param file - CV file (PDF, DOCX, etc.) or encrypted file
 * @returns Blob ID for storing in smart contract
 */
export async function uploadCV(file: File): Promise<string> {
  // Validate file type (allow encrypted files)
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/octet-stream", // Encrypted files
  ]

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please upload PDF, DOC, DOCX, or TXT file.")
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    throw new Error("File too large. Maximum size is 10MB.")
  }

  const result = await uploadToWalrus(file, {
    epochs: 10, // Store for 10 epochs (~20 days on testnet)
    deletable: true,
  })

  return result.blobId
}

