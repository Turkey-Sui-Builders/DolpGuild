"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ConnectModal, useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit"
import { formatAddress } from "@mysten/sui/utils"
import { useState } from "react"
import { UserRound } from "lucide-react"

export function Navigation() {
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const account = useCurrentAccount()
  const { mutate: disconnect } = useDisconnectWallet()

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-[76px] items-center justify-between px-4">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image
                src="/images/dolpguild-logo.jpeg"
                alt="DolpGuild Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-2xl font-semibold text-foreground leading-none">DolpGuild</span>
            </Link>
            <div className="hidden md:flex items-center gap-7">
              <Link
                href="/pods"
                className="text-base font-semibold text-foreground/80 hover:text-foreground transition-colors"
              >
                Pods
              </Link>
              <Link
                href="/opportunities"
                className="text-base font-semibold text-foreground/80 hover:text-foreground transition-colors"
              >
                Opportunities
              </Link>
              {account && (
                <Link
                  href="/my-jobs"
                  className="text-base font-semibold text-foreground/80 hover:text-foreground transition-colors"
                >
                  My Jobs
                </Link>
              )}
              <Button asChild variant="ghost" className="hidden sm:flex text-base font-semibold px-4 py-2">
                <Link href="/post-job">Post a Job</Link>
              </Button>
              {account && (
                <Link
                  href="/debug/applications"
                  className="text-base font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Debug
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-full border border-border hover:bg-muted"
            >
              <Link href="/profile" aria-label="Profile">
                <UserRound className="h-5 w-5" />
              </Link>
            </Button>
            <ConnectModal
              open={walletModalOpen}
              onOpenChange={setWalletModalOpen}
              trigger={
                <Button
                  onClick={() => setWalletModalOpen(true)}
                  variant={account ? "outline" : "default"}
                  className={`font-semibold h-11 px-5 text-base ${account ? "bg-transparent" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                >
                  {account ? formatAddress(account.address) : "Connect Sui Wallet"}
                </Button>
              }
            />
            {account && (
              <Button
                variant="ghost"
                className="h-11 px-4 text-sm font-semibold"
                onClick={() => disconnect()}
              >
                Disconnect
              </Button>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
