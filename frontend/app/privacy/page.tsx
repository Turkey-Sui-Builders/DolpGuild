import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, Database, UserCheck, Globe, Mail } from "lucide-react"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-sky-100 dark:bg-sky-900/30 rounded-full mb-6">
            <Shield className="h-8 w-8 text-sky-600 dark:text-sky-400" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Last updated: November 2025
          </p>
        </div>

        <div className="space-y-8">
          <Card className="border-slate-100 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-sky-500" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
              <p>
                DolpGuild collects information to provide and improve our services. This includes:
              </p>
              <ul>
                <li>
                  <strong>Wallet Information:</strong> Your Sui wallet address when you connect to our
                  platform. This is your primary identifier on DolpGuild.
                </li>
                <li>
                  <strong>Profile Information:</strong> Display name, professional title, skills, bio,
                  location, and social links that you voluntarily provide.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you interact with our platform,
                  including pods joined, opportunities applied to, and transactions completed.
                </li>
                <li>
                  <strong>On-Chain Data:</strong> Transaction history, reputation scores, and badges
                  stored on the Sui blockchain.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-slate-100 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="h-5 w-5 text-teal-500" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
              <p>We use the collected information for the following purposes:</p>
              <ul>
                <li>To provide and maintain our platform services</li>
                <li>To match you with relevant pods and opportunities</li>
                <li>To calculate and display your reputation scores</li>
                <li>To process payments and transactions on the Sui blockchain</li>
                <li>To send you notifications about your applications and opportunities</li>
                <li>To improve our platform and develop new features</li>
                <li>To detect and prevent fraud or abuse</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-slate-100 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-purple-500" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
              <p>
                We implement industry-standard security measures to protect your data:
              </p>
              <ul>
                <li>All data transmissions are encrypted using TLS/SSL protocols</li>
                <li>Sensitive data is encrypted at rest</li>
                <li>We use secure wallet connection protocols (no private keys are ever shared)</li>
                <li>Regular security audits are conducted on our smart contracts</li>
                <li>Access to personal data is restricted to authorized personnel only</li>
              </ul>
              <p>
                <strong>Blockchain Transparency:</strong> Please note that transactions and reputation
                data stored on the Sui blockchain are publicly visible by design. This transparency is
                a core feature of decentralized systems.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-100 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-indigo-500" />
                Data Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
              <p>We may share your information in the following circumstances:</p>
              <ul>
                <li>
                  <strong>With Pods:</strong> When you join a pod or apply to an opportunity, relevant
                  profile information is shared with pod administrators.
                </li>
                <li>
                  <strong>Public Profile:</strong> Information you choose to make public will be
                  visible to all DolpGuild users.
                </li>
                <li>
                  <strong>Service Providers:</strong> We may share data with trusted third-party
                  services that help us operate the platform (e.g., analytics, hosting).
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose information if required by law
                  or to protect the rights and safety of our users.
                </li>
              </ul>
              <p>
                We do <strong>not</strong> sell your personal information to third parties.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-100 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <UserCheck className="h-5 w-5 text-emerald-500" />
                Your Rights & Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
              <p>You have the following rights regarding your data:</p>
              <ul>
                <li>
                  <strong>Access:</strong> Request a copy of the personal data we hold about you.
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate information in your
                  profile.
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your off-chain profile data. Note
                  that on-chain data cannot be deleted due to blockchain immutability.
                </li>
                <li>
                  <strong>Privacy Settings:</strong> Control your profile visibility and notification
                  preferences in Settings.
                </li>
                <li>
                  <strong>Disconnect:</strong> You can disconnect your wallet at any time, which will
                  end your active session.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-slate-100 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-500" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
              <p>
                If you have any questions or concerns about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <ul>
                <li>
                  Email:{" "}
                  <a href="mailto:privacy@dolpguild.io" className="text-sky-600 hover:text-sky-700">
                    privacy@dolpguild.io
                  </a>
                </li>
                <li>Discord: DolpGuild Community Server</li>
                <li>Twitter: @DolpGuild</li>
              </ul>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-6">
                This Privacy Policy may be updated periodically. We will notify users of significant
                changes through our platform or email. Continued use of DolpGuild after changes
                constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
