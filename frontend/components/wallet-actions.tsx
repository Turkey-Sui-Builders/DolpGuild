"use client"

import { useMemo } from "react"
import { useSignAndExecuteTransaction, useSuiClient, useSuiClientQuery, useCurrentAccount } from "@mysten/dapp-kit"
import { Transaction } from "@mysten/sui/transactions"
import { formatAddress } from "@mysten/sui/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wallet, Zap } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function WalletActionsCard() {
  const account = useCurrentAccount()
  const suiClient = useSuiClient()
  const { toast } = useToast()

  const { data: balance, isLoading: balanceLoading } = useSuiClientQuery(
    {
      method: "getBalance",
      params: {
        owner: account?.address || "",
        coinType: "0x2::sui::SUI",
      },
    },
    {
      enabled: !!account,
    },
  )

  const { mutateAsync: signAndExecuteTransaction, isPending } = useSignAndExecuteTransaction()

  const readableBalance = useMemo(() => {
    if (!balance) return "—"
    const mist = BigInt(balance.totalBalance)
    const sui = Number(mist) / 1_000_000_000
    return `${sui.toLocaleString(undefined, { maximumFractionDigits: 4 })} SUI`
  }, [balance])

  const handleSelfTransfer = async () => {
    if (!account) {
      toast({
        title: "Connect wallet",
        description: "Please connect a Sui wallet to run a demo transaction.",
        variant: "destructive",
      })
      return
    }

    try {
      const tx = new Transaction()
      const [tinyCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(1)])
      tx.transferObjects([tinyCoin], tx.pure.address(account.address))

      await signAndExecuteTransaction({
        transaction: tx,
        chain: "sui:testnet",
        options: {
          showEffects: true,
        },
      })

      toast({
        title: "Transaction sent",
        description: `Sent a 1 MIST self-transfer on ${suiClient.currentNetwork}`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Transaction failed",
        description: error instanceof Error ? error.message : "Unable to sign transaction",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Wallet</CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Wallet className="h-4 w-4" />
            {suiClient.currentNetwork}
          </Badge>
        </div>
        <CardDescription>Live balance and a 1 MIST self-transfer demo.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-800/60 px-4 py-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Connected account</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {account ? formatAddress(account.address) : "Not connected"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Balance</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {balanceLoading ? "Loading..." : readableBalance}
            </p>
          </div>
        </div>
        <Button
          onClick={handleSelfTransfer}
          disabled={!account || isPending}
          className="w-full justify-center gap-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          <Zap className="h-4 w-4" />
          Run 1 MIST self-transfer (testnet)
        </Button>
      </CardContent>
    </Card>
  )
}
