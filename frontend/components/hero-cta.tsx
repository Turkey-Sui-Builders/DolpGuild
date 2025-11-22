"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ConnectModal, useCurrentAccount } from "@mysten/dapp-kit"
import { useRouter } from "next/navigation"

export function HeroCTA() {
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const account = useCurrentAccount()
  const router = useRouter()

  const handleConnectClick = () => {
    if (account) {
      // Already connected, navigate to pods
      router.push("/pods")
    } else {
      setWalletModalOpen(true)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <ConnectModal
        open={walletModalOpen}
        onOpenChange={(open) => {
          setWalletModalOpen(open)
          // If modal closes and user is now connected, redirect to pods
          if (!open && account) {
            router.push("/pods")
          }
        }}
        trigger={
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 h-14"
            onClick={handleConnectClick}
          >
            {account ? "View Pods" : "Connect Sui Wallet & Join Pods"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        }
      />
      <Button size="lg" variant="outline" className="font-semibold text-lg px-8 h-14 bg-transparent" asChild>
        <Link href="/pods">Explore Pods Without Connecting</Link>
      </Button>
    </div>
  )
}

export function CTASection() {
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const account = useCurrentAccount()
  const router = useRouter()

  return (
    <ConnectModal
      open={walletModalOpen}
      onOpenChange={(open) => {
        setWalletModalOpen(open)
        if (!open && account) {
          router.push("/pods")
        }
      }}
      trigger={
        <Button
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 h-14"
          onClick={() => {
            if (account) {
              router.push("/pods")
            } else {
              setWalletModalOpen(true)
            }
          }}
        >
          {account ? "View Pods" : "Connect Sui Wallet & Join Pods"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      }
    />
  )
}
