'use client'

import { JSX } from 'react'
import {
  HeroSection,
  FearAndGreedPreview,
  WalletExplorerPreview,
  FeaturesSection,
} from '@/components'

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
