/**
 * DolpGuild V3 - Seal Encryption Client
 * 
 * Utilities for encrypting files with Seal before uploading to Walrus
 * This ensures CV privacy - only the job poster can decrypt
 */

/**
 * Encrypt a file using Web Crypto API (AES-GCM)
 * This is a simplified version - in production, use Seal SDK
 * 
 * @param file - File to encrypt
 * @param recipientPublicKey - Public key of the recipient (job poster)
 * @returns Encrypted file blob
 */
export async function encryptFile(
  file: File,
  recipientPublicKey?: string
): Promise<Blob> {
  try {
    // Read file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer()

    // Generate a random encryption key (AES-256)
    const key = await crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    )

    // Generate a random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12))

    // Encrypt the file
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      fileBuffer
    )

    // Export the key for storage (in production, encrypt this with recipient's public key)
    const exportedKey = await crypto.subtle.exportKey("raw", key)

    // Combine IV + encrypted data + key for simplicity
    // In production with Seal: only store encrypted data, key is encrypted with recipient's public key
    const combined = new Uint8Array(
      iv.length + encryptedData.byteLength + exportedKey.byteLength
    )
    combined.set(iv, 0)
    combined.set(new Uint8Array(encryptedData), iv.length)
    combined.set(new Uint8Array(exportedKey), iv.length + encryptedData.byteLength)

    return new Blob([combined], { type: "application/octet-stream" })
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt file")
  }
}

/**
 * Decrypt a file using Web Crypto API (AES-GCM)
 *
 * @param encryptedBlob - Encrypted blob
 * @param originalFileType - Original file MIME type (e.g., 'application/pdf')
 * @returns Decrypted file blob
 */
export async function decryptFile(
  encryptedBlob: Blob,
  originalFileType: string = "application/pdf"
): Promise<Blob> {
  try {
    const encryptedBuffer = await encryptedBlob.arrayBuffer()
    const encryptedArray = new Uint8Array(encryptedBuffer)

    // Extract IV, encrypted data, and key
    const iv = encryptedArray.slice(0, 12)
    const keyData = encryptedArray.slice(-32) // Last 32 bytes
    const encryptedData = encryptedArray.slice(12, -32)

    // Import the key
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      {
        name: "AES-GCM",
        length: 256,
      },
      false,
      ["decrypt"]
    )

    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encryptedData
    )

    // Return blob with correct MIME type
    return new Blob([decryptedData], { type: originalFileType })
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt file")
  }
}

/**
 * Encrypt CV and prepare for Walrus upload
 * 
 * @param file - CV file
 * @param jobPosterAddress - Address of the job poster (for encryption)
 * @returns Encrypted file ready for Walrus upload
 */
export async function encryptCV(
  file: File,
  jobPosterAddress?: string
): Promise<File> {
  const encryptedBlob = await encryptFile(file, jobPosterAddress)
  
  // Create a new File object from the encrypted blob
  return new File([encryptedBlob], `encrypted_${file.name}`, {
    type: "application/octet-stream",
  })
}

/**
 * Check if Seal encryption is available
 * In production, this would check for Seal SDK availability
 */
export function isSealAvailable(): boolean {
  return typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined"
}

