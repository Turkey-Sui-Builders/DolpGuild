/**
 * DolpGuild V3 - Sui Client Utilities
 * 
 * Helper functions for interacting with the DolpGuild smart contracts
 */

import { SuiClient } from "@mysten/sui/client"
import { Transaction } from "@mysten/sui/transactions"
import { 
  PACKAGE_ID, 
  GLOBAL_REGISTRY, 
  BADGE_REGISTRY,
  FEATURED_JOB_REGISTRY,
  CLOCK_OBJECT,
  RANDOM_OBJECT,
  MODULES,
  NETWORK,
} from "./constants"

// Initialize Sui Client
export const suiClient = new SuiClient({
  url: NETWORK === "testnet" 
    ? "https://fullnode.testnet.sui.io:443"
    : "https://fullnode.mainnet.sui.io:443"
})

/**
 * Create a new Pod
 */
export function createPodTx(
  name: string,
  description: string,
  category: string = "Other",
  logoUrl: string = ""
) {
  const tx = new Transaction()

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.DOLPHGUILD}::create_pod`,
    arguments: [
      tx.object(GLOBAL_REGISTRY),
      tx.pure.string(name),
      tx.pure.string(description),
      tx.pure.string(category),
      tx.pure.string(logoUrl),
      tx.object(CLOCK_OBJECT),
    ],
  })

  return tx
}

/**
 * Join an existing Pod
 */
export function joinPodTx(podId: string) {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.DOLPHGUILD}::join_pod`,
    arguments: [
      tx.object(podId),
      tx.object(CLOCK_OBJECT),
    ],
  })
  
  return tx
}

/**
 * Hire a Candidate (auto mints badge & updates reputation)
 */
export function hireCandidateTx(
  jobId: string,
  applicationId: string,
  candidateAddress: string,
  companyName: string,
  companyLogoUrl: string
) {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.DOLPHGUILD}::hire_candidate`,
    arguments: [
      tx.object(jobId),
      tx.object(applicationId),
      tx.pure.address(candidateAddress),
      tx.object(BADGE_REGISTRY),
      tx.pure.string(companyName),
      tx.pure.string(companyLogoUrl),
      tx.object(CLOCK_OBJECT),
    ],
  })
  
  return tx
}

/**
 * Get Featured Job of the Day (uses Random object)
 */
export function getFeaturedJobTx() {
  const tx = new Transaction()
  
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.FEATURED}::select_featured_job`,
    arguments: [
      tx.object(FEATURED_JOB_REGISTRY),
      tx.object(GLOBAL_REGISTRY),
      tx.object(RANDOM_OBJECT),
      tx.object(CLOCK_OBJECT),
    ],
  })
  
  return tx
}

/**
 * Enter Job Lottery
 */
export function enterLotteryTx(lotteryId: string) {
  const tx = new Transaction()

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.FEATURED}::enter_lottery`,
    arguments: [
      tx.object(lotteryId),
      tx.object(CLOCK_OBJECT),
    ],
  })

  return tx
}

/**
 * Create a job posting transaction
 */
export function postJobTx(
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
) {
  const tx = new Transaction()

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.DOLPHGUILD}::post_job`,
    arguments: [
      tx.object(GLOBAL_REGISTRY),
      tx.pure.id(podId),
      tx.pure.string(title),
      tx.pure.string(description),
      tx.pure.string(requirements),
      tx.pure.u64(salaryAmount),
      tx.pure.bool(hasSalary),
      tx.pure.u64(deadlineMs),
      tx.pure.bool(hasDeadline),
      tx.pure.u8(jobType),
      tx.pure.string(companyName),
      tx.pure.string(companyLogoUrl),
      tx.pure.string(location),
      tx.pure.vector("string", requiredSkills),
      tx.object(CLOCK_OBJECT),
    ],
  })

  return tx
}

/**
 * Submit application to a job
 */
export function submitApplicationTx(
  jobId: string,
  podId: string,
  coverLetter: string,
  cvBlobId: string = "",
  hasCvBlob: boolean = false,
  portfolioUrl: string = "",
  hasPortfolio: boolean = false,
  encryptedCvBlobId: string = "",
  hasEncryptedCv: boolean = false
) {
  const tx = new Transaction()

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULES.DOLPHGUILD}::submit_application`,
    arguments: [
      tx.object(GLOBAL_REGISTRY),
      tx.object(jobId),
      tx.pure.id(podId),
      tx.pure.string(coverLetter),
      tx.pure.string(cvBlobId),
      tx.pure.bool(hasCvBlob),
      tx.pure.string(portfolioUrl),
      tx.pure.bool(hasPortfolio),
      tx.pure.string(encryptedCvBlobId),
      tx.pure.bool(hasEncryptedCv),
      tx.object(CLOCK_OBJECT),
    ],
  })

  return tx
}

/**
 * Fetch user's reputation profile
 */
export async function fetchUserReputation(userAddress: string) {
  try {
    // Get all objects owned by user
    const objects = await suiClient.getOwnedObjects({
      owner: userAddress,
      filter: {
        StructType: `${PACKAGE_ID}::${MODULES.REPUTATION}::ReputationProfile`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    })

    if (objects.data.length === 0) {
      return null
    }

    const reputationObj = objects.data[0]
    return reputationObj
  } catch (error) {
    console.error("Error fetching user reputation:", error)
    return null
  }
}

/**
 * Fetch user's applications
 */
export async function fetchUserApplications(userAddress: string) {
  try {
    const objects = await suiClient.getOwnedObjects({
      owner: userAddress,
      filter: {
        StructType: `${PACKAGE_ID}::${MODULES.DOLPHGUILD}::Application`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    })

    return objects.data.filter((obj: any) => obj.data !== null)
  } catch (error) {
    console.error("Error fetching user applications:", error)
    return []
  }
}

/**
 * Fetch user's transaction history
 */
export async function fetchUserTransactions(userAddress: string, limit: number = 20) {
  try {
    const txs = await suiClient.queryTransactionBlocks({
      filter: {
        FromAddress: userAddress,
      },
      options: {
        showEffects: true,
        showInput: true,
        showEvents: true,
      },
      limit,
      order: "descending", // Most recent first
    })

    return txs.data
  } catch (error) {
    console.error("Error fetching user transactions:", error)
    return []
  }
}

/**
 * Fetch user's created pods
 */
export async function fetchUserPods(userAddress: string) {
  try {
    const objects = await suiClient.getOwnedObjects({
      owner: userAddress,
      filter: {
        StructType: `${PACKAGE_ID}::${MODULES.DOLPHGUILD}::Pod`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    })

    return objects.data.filter((obj: any) => obj.data !== null)
  } catch (error) {
    console.error("Error fetching user pods:", error)
    return []
  }
}

/**
 * Fetch jobs for a specific pod
 */
export async function fetchPodJobs(podId: string) {
  try {
    // Query all JobPostedEvent events
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::${MODULES.DOLPHGUILD}::JobPostedEvent`,
      },
      limit: 50,
      order: "descending",
    })

    // Filter events by pod_id
    const podJobEvents = events.data.filter((event: any) => event.parsedJson.pod_id === podId)
    const jobIds = podJobEvents.map((event: any) => event.parsedJson.job_id)

    if (jobIds.length === 0) {
      return []
    }

    // Fetch job objects
    const jobs = await suiClient.multiGetObjects({
      ids: jobIds,
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    })

    return jobs.filter((job: any) => job.data !== null)
  } catch (error) {
    console.error("Error fetching pod jobs:", error)
    return []
  }
}

/**
 * Fetch applications for a specific job
 */
export async function fetchJobApplications(jobId: string) {
  try {
    // Query all ApplicationSubmittedEvent events
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::${MODULES.DOLPHGUILD}::ApplicationSubmittedEvent`,
      },
      limit: 100,
      order: "descending",
    })

    // Filter events by job_id
    const jobAppEvents = events.data.filter((event: any) => event.parsedJson.job_id === jobId)
    const applicationIds = jobAppEvents.map((event: any) => event.parsedJson.application_id)

    if (applicationIds.length === 0) {
      return []
    }

    // Fetch application objects
    const applications = await suiClient.multiGetObjects({
      ids: applicationIds,
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    })

    return applications.filter((app: any) => app.data !== null)
  } catch (error) {
    console.error("Error fetching job applications:", error)
    return []
  }
}

/**
 * Fetch user's job postings
 */
export async function fetchUserJobs(userAddress: string) {
  try {
    const objects = await suiClient.getOwnedObjects({
      owner: userAddress,
      filter: {
        StructType: `${PACKAGE_ID}::${MODULES.DOLPHGUILD}::JobPosting`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    })

    return objects.data.filter((obj: any) => obj.data !== null)
  } catch (error) {
    console.error("Error fetching user jobs:", error)
    return []
  }
}

/**
 * Fetch user's badges
 */
export async function fetchUserBadges(userAddress: string) {
  try {
    const objects = await suiClient.getOwnedObjects({
      owner: userAddress,
      filter: {
        StructType: `${PACKAGE_ID}::${MODULES.REPUTATION}::Badge`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    })

    return objects.data.filter((obj: any) => obj.data !== null)
  } catch (error) {
    console.error("Error fetching user badges:", error)
    return []
  }
}

/**
 * Fetch all Pods from the blockchain using events
 * Note: This fetches recent pod creation events
 */
export async function fetchPods() {
  try {
    // Query PodCreatedEvent events
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::${MODULES.DOLPHGUILD}::PodCreatedEvent`,
      },
      limit: 50,
      order: "descending",
    })

    // Fetch pod objects from event data
    const podIds = events.data.map((event: any) => event.parsedJson.pod_id)

    if (podIds.length === 0) {
      return []
    }

    const pods = await suiClient.multiGetObjects({
      ids: podIds,
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    })

    return pods.filter((pod: any) => pod.data !== null)
  } catch (error) {
    console.error("Error fetching pods:", error)
    return []
  }
}

/**
 * Fetch all Jobs from the blockchain using events
 */
export async function fetchJobs() {
  try {
    // Query JobPostedEvent events
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::${MODULES.DOLPHGUILD}::JobPostedEvent`,
      },
      limit: 50,
      order: "descending",
    })

    // Fetch job objects from event data
    const jobIds = events.data.map((event: any) => event.parsedJson.job_id)

    if (jobIds.length === 0) {
      return []
    }

    const jobs = await suiClient.multiGetObjects({
      ids: jobIds,
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    })

    return jobs.filter((job: any) => job.data !== null)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return []
  }
}

/**
 * Fetch user's owned objects (Pods, Applications, Badges)
 */
export async function fetchUserObjects(address: string) {
  const [pods, applications, badges] = await Promise.all([
    suiClient.getOwnedObjects({
      owner: address,
      filter: {
        StructType: `${PACKAGE_ID}::${MODULES.DOLPHGUILD}::Pod`,
      },
      options: {
        showContent: true,
      },
    }),
    suiClient.getOwnedObjects({
      owner: address,
      filter: {
        StructType: `${PACKAGE_ID}::${MODULES.DOLPHGUILD}::Application`,
      },
      options: {
        showContent: true,
      },
    }),
    suiClient.getOwnedObjects({
      owner: address,
      filter: {
        StructType: `${PACKAGE_ID}::${MODULES.EMPLOYMENT_BADGE}::EmploymentBadge`,
      },
      options: {
        showContent: true,
        showDisplay: true,
      },
    }),
  ])

  return {
    pods: pods.data,
    applications: applications.data,
    badges: badges.data,
  }
}

