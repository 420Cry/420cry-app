'use client'

import { JSX } from 'react'
import HeroSection from './HeroSection'
import FearAndGreedPreview from './FearAndGreedPreview'
import WalletExplorerPreview from './WalletExplorerPreview'
import FeaturesSection from './FeaturesSection'

export default function LandingPage(): JSX.Element {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FearAndGreedPreview />
      <WalletExplorerPreview />
      <FeaturesSection />
    </div>
  )
}
