/**
 * DolpGuild V3 - React Query Hooks for Sui Data
 * 
 * Custom hooks for fetching data from the blockchain
 */

"use client"

import { useQuery } from "@tanstack/react-query"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { fetchPods, fetchJobs, fetchUserObjects } from "@/lib/sui-client"

/**
 * Fetch all Pods from the blockchain
 */
export function usePods() {
  return useQuery({
    queryKey: ["pods"],
    queryFn: fetchPods,
    refetchInterval: 10000, // Refetch every 10 seconds
  })
}

/**
 * Fetch all Jobs from the blockchain
 */
export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
    refetchInterval: 10000,
  })
}

/**
 * Fetch current user's objects (Pods, Applications, Badges)
 */
export function useUserObjects() {
  const account = useCurrentAccount()

  return useQuery({
    queryKey: ["user-objects", account?.address],
    queryFn: () => {
      if (!account?.address) {
        throw new Error("No wallet connected")
      }
      return fetchUserObjects(account.address)
    },
    enabled: !!account?.address,
    refetchInterval: 10000,
  })
}

/**
 * Fetch user's Pods
 */
export function useUserPods() {
  const { data, ...rest } = useUserObjects()
  
  return {
    data: data?.pods,
    ...rest,
  }
}

/**
 * Fetch user's Applications
 */
export function useUserApplications() {
  const { data, ...rest } = useUserObjects()
  
  return {
    data: data?.applications,
    ...rest,
  }
}

/**
 * Fetch user's Employment Badges
 */
export function useUserBadges() {
  const { data, ...rest } = useUserObjects()
  
  return {
    data: data?.badges,
    ...rest,
  }
}

