"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Bell,
  Camera,
  Globe,
  Lock,
  Mail,
  Save,
  Shield,
  User,
  Wallet,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [profilePublic, setProfilePublic] = useState(true)
  const [showEarnings, setShowEarnings] = useState(false)

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-1 rounded-full h-auto w-full justify-start overflow-x-auto">
            <TabsTrigger
              value="profile"
              className="rounded-full px-6 py-2 data-[state=active]:bg-sky-50 data-[state=active]:text-sky-700 dark:data-[state=active]:bg-sky-900/30 dark:data-[state=active]:text-sky-300"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="rounded-full px-6 py-2 data-[state=active]:bg-sky-50 data-[state=active]:text-sky-700 dark:data-[state=active]:bg-sky-900/30 dark:data-[state=active]:text-sky-300"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="rounded-full px-6 py-2 data-[state=active]:bg-sky-50 data-[state=active]:text-sky-700 dark:data-[state=active]:bg-sky-900/30 dark:data-[state=active]:text-sky-300"
            >
              <Lock className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="rounded-full px-6 py-2 data-[state=active]:bg-sky-50 data-[state=active]:text-sky-700 dark:data-[state=active]:bg-sky-900/30 dark:data-[state=active]:text-sky-300"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Wallet
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile details visible to other users and pods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-slate-100 dark:border-slate-800">
                      <AvatarImage src="/placeholder.svg?key=user-avatar" />
                      <AvatarFallback className="text-xl bg-sky-100 text-sky-700">JD</AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 rounded-full shadow-md h-8 w-8"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Profile Photo</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      PNG, JPG or GIF. Max 2MB.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Upload New
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      placeholder="Your display name"
                      defaultValue="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="@username" defaultValue="johndoe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Senior Frontend Developer"
                    defaultValue="Senior Frontend Developer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell others about yourself..."
                    className="min-h-[100px]"
                    defaultValue="Passionate frontend developer with 5+ years of experience in React and Web3. Building the future of decentralized applications."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    defaultValue="San Francisco, CA"
                  />
                </div>

                <Separator />

                {/* Skills */}
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {["React", "Move", "TypeScript", "Solidity", "UI/UX"].map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-sky-50 text-sky-700 border-sky-100 cursor-pointer hover:bg-sky-100"
                      >
                        {skill} &times;
                      </Badge>
                    ))}
                  </div>
                  <Input placeholder="Add a skill and press Enter" />
                </div>

                <Separator />

                {/* Social Links */}
                <div className="space-y-4">
                  <Label>Social Links</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm text-slate-500">
                        <Globe className="h-4 w-4 inline mr-2" />
                        Website
                      </Label>
                      <Input id="website" placeholder="https://yoursite.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="text-sm text-slate-500">
                        Twitter / X
                      </Label>
                      <Input id="twitter" placeholder="@username" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github" className="text-sm text-slate-500">
                        GitHub
                      </Label>
                      <Input id="github" placeholder="username" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discord" className="text-sm text-slate-500">
                        Discord
                      </Label>
                      <Input id="discord" placeholder="username#0000" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Receive updates about your applications and opportunities
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Push Notifications</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Get instant notifications on your device
                      </p>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Marketing Emails</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Receive news, updates, and promotional content
                      </p>
                    </div>
                    <Switch
                      checked={marketingEmails}
                      onCheckedChange={setMarketingEmails}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900 dark:text-white">Notify me about</h3>
                  <div className="space-y-3">
                    {[
                      "New opportunities matching my skills",
                      "Application status updates",
                      "Messages from pod members",
                      "Pod announcements",
                      "Payment received",
                      "Reputation changes",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <Switch defaultChecked />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy">
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>
                  Control who can see your information and how your data is used
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Public Profile</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Allow anyone to view your profile and portfolio
                      </p>
                    </div>
                    <Switch checked={profilePublic} onCheckedChange={setProfilePublic} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Show Earnings</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Display your total earnings on your public profile
                      </p>
                    </div>
                    <Switch checked={showEarnings} onCheckedChange={setShowEarnings} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Show in Pod Directory</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Appear in pod member listings
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-sky-500" />
                    Security
                  </h3>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline" className="bg-transparent">
                        Enable
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Active Sessions</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Manage devices where you&apos;re logged in
                        </p>
                      </div>
                      <Button variant="outline" className="bg-transparent">
                        View All
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-300">Danger Zone</p>
                      <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                        Permanently delete your account and all associated data
                      </p>
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700 bg-transparent"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Settings */}
          <TabsContent value="wallet">
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle>Wallet & Payments</CardTitle>
                <CardDescription>Manage your connected wallets and payment preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900 dark:text-white">Connected Wallets</h3>

                  <div className="p-4 bg-gradient-to-br from-sky-50 to-teal-50 dark:from-sky-900/20 dark:to-teal-900/20 rounded-xl border border-sky-100 dark:border-sky-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-sky-500 rounded-full flex items-center justify-center">
                          <Wallet className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Sui Wallet</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                            0x1a2b...3c4d
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-0">Primary</Badge>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Another Wallet
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900 dark:text-white">Payment Preferences</h3>

                  <div className="space-y-2">
                    <Label htmlFor="paymentWallet">Default Payment Wallet</Label>
                    <Input
                      id="paymentWallet"
                      placeholder="0x..."
                      defaultValue="0x1a2b3c4d5e6f7890..."
                      className="font-mono"
                    />
                    <p className="text-xs text-slate-500">
                      This is where you&apos;ll receive payments for completed jobs
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900 dark:text-white">Transaction History</h3>
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No transactions yet</p>
                    <p className="text-sm">Your payment history will appear here</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
