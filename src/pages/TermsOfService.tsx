import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Users, Gavel, AlertTriangle, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Gavel className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
              <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 space-y-8"
        >
          {/* Introduction */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-white">Introduction</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Welcome to SeeUTrending, a gamified platform that connects Polish TikTok creators with branded content contests. 
              By using our service, you agree to these Terms of Service ("Terms"). Please read them carefully.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              By accessing and using SeeUTrending, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by these terms, you are not authorized to use or access this service.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">2. User Accounts and Registration</h3>
            </div>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• You must be at least 13 years old to use SeeUTrending</li>
              <li>• You are responsible for maintaining the confidentiality of your account</li>
              <li>• You must provide accurate and complete registration information</li>
              <li>• You are responsible for all activities that occur under your account</li>
              <li>• You must notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          {/* TikTok Integration */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">3. TikTok Integration</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              SeeUTrending integrates with TikTok to provide contest and analytics features:
            </p>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• You may connect your TikTok account to participate in contests</li>
              <li>• We access only the data you explicitly authorize through TikTok's OAuth process</li>
              <li>• You can disconnect your TikTok account at any time</li>
              <li>• We comply with TikTok's Terms of Service and API policies</li>
            </ul>
          </section>

          {/* Contest Participation */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">4. Contest Participation</h3>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• Contest entries must comply with contest rules and guidelines</li>
              <li>• Content must be original and not infringe on third-party rights</li>
              <li>• We reserve the right to disqualify entries that violate terms</li>
              <li>• Winners are determined based on transparent scoring algorithms</li>
              <li>• Prizes and rewards are distributed as specified in contest terms</li>
            </ul>
          </section>

          {/* Gamification System */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">5. Gamification and Rewards</h3>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• XP points and badges are earned through platform participation</li>
              <li>• Rewards have no monetary value unless explicitly stated</li>
              <li>• We reserve the right to adjust the gamification system</li>
              <li>• Fraudulent activity may result in loss of rewards and account suspension</li>
            </ul>
          </section>

          {/* Prohibited Conduct */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold text-white">6. Prohibited Conduct</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">You agree not to:</p>
            <ul className="text-gray-300 space-y-2 leading-relaxed">
              <li>• Use the service for any unlawful purpose</li>
              <li>• Submit content that is offensive, defamatory, or inappropriate</li>
              <li>• Attempt to manipulate contest results or gaming systems</li>
              <li>• Interfere with the proper working of the service</li>
              <li>• Create fake accounts or use automated tools</li>
              <li>• Violate any applicable laws or regulations</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">7. Intellectual Property</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              The SeeUTrending platform, including its design, functionality, and content, is owned by us and protected by intellectual property laws. 
              You retain ownership of content you submit, but grant us necessary rights to operate the service.
            </p>
          </section>

          {/* Privacy */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">8. Privacy</h3>
            <p className="text-gray-300 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, 
              to understand our practices.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">9. Limitation of Liability</h3>
            <p className="text-gray-300 leading-relaxed">
              SeeUTrending is provided "as is" without warranties of any kind. We shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages resulting from your use of the service.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">10. Termination</h3>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to terminate or suspend your account and access to the service at our sole discretion, 
              without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">11. Changes to Terms</h3>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of significant changes 
              via email or platform notifications. Continued use of the service after changes constitutes acceptance.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">12. Governing Law</h3>
            <p className="text-gray-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Poland, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-600 pt-6">
            <div className="flex items-center space-x-2 mb-3">
              <Mail className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">Contact Information</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
              <p className="text-white font-medium">SeeUTrending Support</p>
              <p className="text-gray-300">Email: legal@seeutrending.com</p>
              <p className="text-gray-300">Website: seeutrending.com</p>
            </div>
          </section>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} SeeUTrending. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  )
}