/**
 * DolpGuild V3 - React Hooks for Sui Transactions
 * 
 * Custom hooks for executing DolpGuild smart contract functions
 */

"use client"

import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit"
import { Transaction } from "@mysten/sui/transactions"
import { useState } from "react"
import { toast } from "sonner"
import { getTxUrl, getSuiscanTxUrl } from "@/lib/constants"

export function useSuiTransaction() {
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction()
  const suiClient = useSuiClient()
  const [isLoading, setIsLoading] = useState(false)

  const executeTransaction = async (
    tx: Transaction,
    options?: {
      onSuccess?: (digest: string) => void
      onError?: (error: Error) => void
      successMessage?: string
      errorMessage?: string
    }
  ) => {
    setIsLoading(true)
    
    try {
      const result = await signAndExecute({
        transaction: tx,
      })

      // Wait for transaction to be confirmed
      await suiClient.waitForTransaction({
        digest: result.digest,
      })

      const suiscanUrl = getSuiscanTxUrl(result.digest)

      // Auto-open Suiscan in new tab
      window.open(suiscanUrl, "_blank")

      toast.success(options?.successMessage || "Transaction successful!", {
        description: "Transaction confirmed! Opening Suiscan...",
        action: {
          label: "View on Suiscan",
          onClick: () => window.open(suiscanUrl, "_blank"),
        },
        duration: 8000,
      })

      options?.onSuccess?.(result.digest)
      
      return result
    } catch (error) {
      console.error("Transaction failed:", error)
      
      toast.error(options?.errorMessage || "Transaction failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      })

      options?.onError?.(error instanceof Error ? error : new Error("Unknown error"))
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    executeTransaction,
    isLoading,
  }
}

/**
 * Hook for creating a Pod
 */
export function useCreatePod() {
  const { executeTransaction, isLoading } = useSuiTransaction()

  const createPod = async (
    name: string,
    description: string,
    category?: string,
    logoUrl?: string
  ) => {
    const { createPodTx } = await import("@/lib/sui-client")
    const tx = createPodTx(name, description, category, logoUrl)

    return executeTransaction(tx, {
      successMessage: "Pod created successfully!",
      errorMessage: "Failed to create pod",
    })
  }

  return { createPod, isLoading }
}

/**
 * Hook for joining a Pod
 */
export function useJoinPod() {
  const { executeTransaction, isLoading } = useSuiTransaction()

  const joinPod = async (podId: string) => {
    const { joinPodTx } = await import("@/lib/sui-client")
    const tx = joinPodTx(podId)
    
    return executeTransaction(tx, {
      successMessage: "Joined pod successfully!",
      errorMessage: "Failed to join pod",
    })
  }

  return { joinPod, isLoading }
}

/**
 * Hook for posting a Job
 */
export function usePostJob() {
  const { executeTransaction, isLoading } = useSuiTransaction()

  const postJob = async (
    podId: string,
    title: string,
    description: string,
    requirements: string,
    salaryAmount: number,
    hasSalary: boolean,
    deadlineMs: number,
    hasDeadline: boolean,
    jobType: number,
    companyName: string,
    companyLogoUrl: string,
    location: string,
    requiredSkills: string[]
  ) => {
    const { postJobTx } = await import("@/lib/sui-client")
    const tx = postJobTx(
      podId,
      title,
      description,
      requirements,
      salaryAmount,
      hasSalary,
      deadlineMs,
      hasDeadline,
      jobType,
      companyName,
      companyLogoUrl,
      location,
      requiredSkills
    )
    
    return executeTransaction(tx, {
      successMessage: "Job posted successfully!",
      errorMessage: "Failed to post job",
    })
  }

  return { postJob, isLoading }
}

/**
 * Hook for submitting an Application
 */
export function useSubmitApplication() {
  const { executeTransaction, isLoading } = useSuiTransaction()

  const submitApplication = async (
    jobId: string,
    podId: string,
    coverLetter: string,
    cvBlobId?: string,
    portfolioUrl?: string,
    encryptedCvBlobId?: string
  ) => {
    const { submitApplicationTx } = await import("@/lib/sui-client")
    const tx = submitApplicationTx(
      jobId,
      podId,
      coverLetter,
      cvBlobId || "",
      !!cvBlobId,
      portfolioUrl || "",
      !!portfolioUrl,
      encryptedCvBlobId || "",
      !!encryptedCvBlobId
    )

    return executeTransaction(tx, {
      successMessage: "Application submitted successfully!",
      errorMessage: "Failed to submit application",
    })
  }

  return { submitApplication, isLoading }
}

/**
 * Hook for hiring a Candidate
 */
export function useHireCandidate() {
  const { executeTransaction, isLoading } = useSuiTransaction()

  const hireCandidate = async (
    jobId: string,
    applicationId: string,
    candidateAddress: string,
    companyName: string,
    companyLogoUrl: string
  ) => {
    const { hireCandidateTx } = await import("@/lib/sui-client")
    const tx = hireCandidateTx(jobId, applicationId, candidateAddress, companyName, companyLogoUrl)
    
    return executeTransaction(tx, {
      successMessage: "Candidate hired successfully! Badge minted.",
      errorMessage: "Failed to hire candidate",
    })
  }

  return { hireCandidate, isLoading }
}

