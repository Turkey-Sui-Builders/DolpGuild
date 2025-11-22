/**
 * DolpGuild V3 - Smart Contract Constants
 * 
 * This file contains all the deployed contract addresses and configuration
 * for the DolpGuild platform on Sui Testnet.
 */

// Package ID - Main DolpGuild V3 Package
export const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID ||
  "0x5e2aa3dedd48e8241bf9a14717668b42cfad18d0cc042b977e42cb9abd3747c0"

// Shared Objects - Global State
export const GLOBAL_REGISTRY = process.env.NEXT_PUBLIC_GLOBAL_REGISTRY ||
  "0xafe8cfa06240263b7869fe66de7e0896c440726981b3b127b1111ecf13007c7b"

export const BADGE_REGISTRY = process.env.NEXT_PUBLIC_BADGE_REGISTRY ||
  "0x128063197e15102462a812d632bdf40b95482fcdb871eea85b9bce9620e1c6cc"

export const VERSION_REGISTRY = process.env.NEXT_PUBLIC_VERSION_REGISTRY ||
  "0xb505652ce5b9ae65c3a9f9deaa27e66dfa2ac75351134e1e16369d7e7c91aa5c"

export const FEATURED_JOB_REGISTRY = process.env.NEXT_PUBLIC_FEATURED_JOB_REGISTRY ||
  "0xb9662b9a96d9027c20bc733966311d2410765cff00fb75a58c1f5fe68ed315b8"

// System Objects
export const CLOCK_OBJECT = process.env.NEXT_PUBLIC_CLOCK_OBJECT || "0x6"
export const RANDOM_OBJECT = process.env.NEXT_PUBLIC_RANDOM_OBJECT || "0x8"

// Module Names
export const MODULES = {
  DOLPHGUILD: "dolphguild",
  REPUTATION: "reputation",
  EMPLOYMENT_BADGE: "employment_badge",
  ESCROW: "escrow",
  ADMIN: "admin",
  FEATURED: "featured",
  DYNAMIC_APPLICATIONS: "dynamic_applications",
} as const

// Walrus Configuration
export const WALRUS_CONFIG = {
  PUBLISHER_URL: process.env.NEXT_PUBLIC_WALRUS_PUBLISHER_URL || 
    "https://publisher.walrus-testnet.walrus.space",
  AGGREGATOR_URL: process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR_URL || 
    "https://aggregator.walrus-testnet.walrus.space",
} as const

// Network Configuration
export const NETWORK = (process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet") as "testnet" | "mainnet"

// Explorer URLs
export const EXPLORER_URL = NETWORK === "testnet"
  ? "https://testnet.suivision.xyz"
  : "https://suivision.xyz"

export const SUISCAN_URL = NETWORK === "testnet"
  ? "https://suiscan.xyz/testnet"
  : "https://suiscan.xyz/mainnet"

export const getObjectUrl = (objectId: string) => `${EXPLORER_URL}/object/${objectId}`
export const getTxUrl = (txDigest: string) => `${EXPLORER_URL}/txblock/${txDigest}`
export const getSuiscanTxUrl = (txDigest: string) => `${SUISCAN_URL}/tx/${txDigest}`
export const getPackageUrl = (packageId: string) => `${EXPLORER_URL}/package/${packageId}`

// Application Status Constants (matching Move contract)
export const APPLICATION_STATUS = {
  PENDING: 0,
  ACCEPTED: 1,
  REJECTED: 2,
} as const

// Reputation Constants (matching Move contract)
export const REPUTATION = {
  BASE: 100,
  HIRE_BONUS: 50,
  APPLICATION_PENALTY: 5,
  BADGE_THRESHOLDS: [100, 250, 500, 1000, 2000],
} as const

// Badge Level Names
export const BADGE_LEVELS = [
  "Newcomer",
  "Rising Star", 
  "Professional",
  "Expert",
  "Master",
  "Legend",
] as const

// Escrow Status Constants
export const ESCROW_STATUS = {
  PENDING: 0,
  COMPLETED: 1,
  CANCELLED: 2,
} as const

// Milestone Status Constants
export const MILESTONE_STATUS = {
  PENDING: 0,
  COMPLETED: 1,
  CANCELLED: 2,
} as const

// Type Helpers
export type ApplicationStatus = typeof APPLICATION_STATUS[keyof typeof APPLICATION_STATUS]
export type EscrowStatus = typeof ESCROW_STATUS[keyof typeof ESCROW_STATUS]
export type MilestoneStatus = typeof MILESTONE_STATUS[keyof typeof MILESTONE_STATUS]
export type BadgeLevel = typeof BADGE_LEVELS[number]
