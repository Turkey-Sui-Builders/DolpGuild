export interface Member {
  id: string
  name: string
  role: string
  avatar: string
}

export interface Opportunity {
  id: string
  title: string
  type: "Project" | "Bounty" | "Full-time"
  reward: string
  description: string
  longDescription?: string
  requirements?: string[]
  postedAt?: string
}

export interface Pod {
  id: string
  name: string
  description: string
  memberCount: number
  projectCount: number
  category: string
  image: string
  tags: string[]
  members: Member[]
  opportunities: Opportunity[]
}

export const PODS: Pod[] = [
  {
    id: "rust-devs",
    name: "Rust Developers",
    description:
      "A collective of elite Rust developers building on the Sui ecosystem. We focus on core infrastructure and DeFi protocols.",
    memberCount: 128,
    projectCount: 15,
    category: "Development",
    image: "/placeholder.svg?key=spnmw",
    tags: ["Move", "Smart Contracts", "DeFi"],
    members: [
      { id: "1", name: "Alex Chen", role: "Lead Dev", avatar: "/placeholder.svg?key=qsty2" },
      { id: "2", name: "Sarah Kim", role: "Contributor", avatar: "/placeholder.svg?key=8dzs5" },
      { id: "3", name: "Mike Ross", role: "Auditor", avatar: "/placeholder.svg?key=bs5e8" },
    ],
    opportunities: [
      {
        id: "opp-1",
        title: "DeFi Protocol Audit",
        type: "Bounty",
        reward: "5000 SUI",
        description: "Audit a new lending protocol smart contracts.",
        longDescription:
          "We are looking for an experienced Move auditor to review the smart contracts for our upcoming lending protocol. The scope includes the lending pool, collateral manager, and oracle integration modules.",
        requirements: [
          "Previous audit experience",
          "Deep understanding of Move security patterns",
          "Report delivery within 2 weeks",
        ],
        postedAt: "2 days ago",
      },
      {
        id: "opp-2",
        title: "Frontend Integration",
        type: "Project",
        reward: "2000 SUI",
        description: "Connect wallet and implement swap UI.",
        longDescription:
          "Implement the frontend interface for a token swap dApp. This involves connecting to the Sui wallet, handling transaction signing, and displaying real-time price data.",
        requirements: ["React/Next.js proficiency", "Sui Wallet Kit experience", "Tailwind CSS"],
        postedAt: "1 week ago",
      },
    ],
  },
  {
    id: "nft-artists",
    name: "NFT Creators",
    description:
      "Digital artists and designers creating the next generation of NFTs on Sui. Collaboration and resource sharing.",
    memberCount: 85,
    projectCount: 24,
    category: "Design",
    image: "/abstract-fluid-art.png",
    tags: ["3D", "Pixel Art", "Generative"],
    members: [
      { id: "4", name: "Davide V", role: "Artist", avatar: "/diverse-group-avatars.png" },
      { id: "5", name: "Elena G", role: "Curator", avatar: "/diverse-group-avatars.png" },
    ],
    opportunities: [
      {
        id: "opp-3",
        title: "Collection Art Generation",
        type: "Project",
        reward: "1500 SUI",
        description: "Generate 10k collection from traits.",
      },
    ],
  },
  {
    id: "sui-marketing",
    name: "Sui Growth",
    description: "Marketing experts and community managers helping projects launch and grow on Sui.",
    memberCount: 210,
    projectCount: 42,
    category: "Marketing",
    image: "/marketing-strategy-meeting.png",
    tags: ["Social Media", "Community", "Events"],
    members: [
      { id: "6", name: "Tom B", role: "Growth Lead", avatar: "/diverse-group-avatars.png" },
      { id: "7", name: "Alice W", role: "CM", avatar: "/diverse-group-avatars.png" },
    ],
    opportunities: [
      {
        id: "opp-4",
        title: "Launch Campaign",
        type: "Full-time",
        reward: "Negotiable",
        description: "Lead the go-to-market strategy for a new DEX.",
      },
    ],
  },
  {
    id: "game-fi",
    name: "GameFi Guild",
    description: "Building the future of gaming on chain. Developers, designers, and economy experts welcome.",
    memberCount: 95,
    projectCount: 8,
    category: "Gaming",
    image: "/diverse-group-playing-board-game.png",
    tags: ["Unity", "Unreal", "Tokenomics"],
    members: [{ id: "8", name: "Chris P", role: "Game Dev", avatar: "/diverse-group-avatars.png" }],
    opportunities: [],
  },
  {
    id: "dao-architects",
    name: "DAO Architects",
    description: "Governance specialists and smart contract engineers designing robust DAO structures.",
    memberCount: 45,
    projectCount: 5,
    category: "Governance",
    image: "/dao.jpg",
    tags: ["Governance", "Voting", "Legal"],
    members: [],
    opportunities: [
      {
        id: "opp-5",
        title: "Governance Proposal Review",
        type: "Bounty",
        reward: "200 SUI",
        description: "Review and comment on AIP-42.",
        longDescription:
          "We need a governance expert to provide a detailed review and constructive feedback on the latest AIP-42 proposal regarding treasury diversification.",
        requirements: ["DAO governance experience", "Written analytical skills"],
        postedAt: "3 days ago",
      },
    ],
  },
  {
    id: "zero-knowledge",
    name: "Zero Knowledge",
    description: "Privacy researchers and ZK-proof implementers pushing the boundaries of privacy on Sui.",
    memberCount: 30,
    projectCount: 3,
    category: "Research",
    image: "/zk.jpg",
    tags: ["Cryptography", "Privacy", "Math"],
    members: [],
    opportunities: [],
  },
]

export function getOpportunityById(id: string): { opportunity: Opportunity; pod: Pod } | null {
  for (const pod of PODS) {
    const opportunity = pod.opportunities.find((o) => o.id === id)
    if (opportunity) {
      return { opportunity, pod }
    }
  }
  return null
}
