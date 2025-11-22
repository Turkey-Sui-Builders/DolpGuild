/**
 * Script to create reputation profile
 * Run this in browser console or as a standalone script
 */

import { Transaction } from "@mysten/sui/transactions"

export async function createReputationProfile(
  signAndExecute: any,
  packageId: string,
  clockObject: string = "0x6"
) {
  console.log("📝 Creating reputation profile...")
  
  const tx = new Transaction()
  tx.moveCall({
    target: `${packageId}::reputation::create_reputation_profile`,
    arguments: [tx.object(clockObject)],
  })

  return new Promise((resolve, reject) => {
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result: any) => {
          console.log("✅ Reputation profile created:", result)
          resolve(result)
        },
        onError: (error: any) => {
          console.error("❌ Failed to create profile:", error)
          reject(error)
        },
      }
    )
  })
}

