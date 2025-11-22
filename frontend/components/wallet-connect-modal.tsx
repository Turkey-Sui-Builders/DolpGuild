"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (address: string) => void
}

const SUI_WALLETS = [
  { name: "Sui Wallet", icon: "🔵" },
  { name: "Suiet Wallet", icon: "🟣" },
  { name: "Ethos Wallet", icon: "🟢" },
  { name: "Martian Wallet", icon: "🔴" },
]

export function WalletConnectModal({ isOpen, onClose, onConnect }: WalletConnectModalProps) {
  const handleConnect = (walletName: string) => {
    // Simulate wallet connection with a mock address
    const mockAddress = "0x" + Math.random().toString(16).substring(2, 42)
    onConnect(mockAddress)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Connect Sui Wallet</DialogTitle>
          <DialogDescription className="text-base">
            Choose your preferred Sui wallet to connect to DolpGuild
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {SUI_WALLETS.map((wallet) => (
            <Button
              key={wallet.name}
              variant="outline"
              className="w-full justify-start gap-3 h-14 text-base hover:bg-muted hover:border-primary transition-all bg-transparent"
              onClick={() => handleConnect(wallet.name)}
            >
              <span className="text-2xl">{wallet.icon}</span>
              <span className="font-medium">{wallet.name}</span>
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
          <Wallet className="h-4 w-4" />
          <span>Built on Sui Network</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
