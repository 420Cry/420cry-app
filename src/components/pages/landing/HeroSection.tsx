'use client'

import { JSX } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { LanguageChangeButton } from '@/components'
import { SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '@/lib'


export default function HeroSection(): JSX.Element {
  const t = useTranslations()

  return (
    <section className="relative overflow-hidden bg-slate-950 text-slate-50">
      {/* Background layers */}
      <div className="absolute inset-0 neon-gradient" aria-hidden />
      <div className="absolute inset-0 neon-grid" aria-hidden />
      <div className="absolute inset-0 grid-lines" aria-hidden />
      <div className="absolute -left-20 top-10 w-72 h-72 bg-purple-700/30 rounded-full orb" />
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-cyan-500/25 rounded-full orb" />

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <div className="glass-outline rounded-full px-3 py-2 shadow-lg shadow-cyan-500/10">
          <LanguageChangeButton />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          {/* Main copy */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 pill">
              <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
              {t('landing.hero.trustIndicators.securePlatform')}
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight gradient-text break-words">
                {t('landing.hero.title')}
              </h1>
              <p className="text-lg md:text-xl text-slate-200/90 max-w-2xl break-words">
                {t('landing.hero.subtitle')}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="pill flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                {t('landing.hero.features.marketIndicators.title')}
              </span>
              <span className="pill flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-300" />
                {t('landing.hero.features.blockchainExplorer.title')}
              </span>
              <span className="pill flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                {t('landing.hero.features.securePlatform.title')}
              </span>
            </div>

            <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 shadow-xl shadow-purple-500/10">
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <Link
                  href={SIGN_UP_ROUTE}
                  className="btn-neon px-6 py-3 text-center w-full sm:w-auto"
                >
                  {t('landing.hero.getStarted')}
                </Link>
                <Link
                  href={SIGN_IN_ROUTE}
                  className="btn-ghost px-6 py-3 text-center w-full sm:w-auto"
                >
                  {t('landing.hero.signIn')}
                </Link>
                <div className="flex-1 text-left text-sm text-slate-300/90 sm:text-right">
                  {t('landing.hero.trustIndicators.professionalTools')}
                </div>
              </div>
              <div className="divider-gradient mt-4" aria-hidden />
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-200/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
                  {t('landing.hero.trustIndicators.realTimeData')}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.45)]" />
                  {t('landing.hero.trustIndicators.securePlatform')}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,0.45)]" />
                  {t('landing.hero.trustIndicators.professionalTools')}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl shadow-amber-500/15">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="pill flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-300" />
                  {t('landing.hero.features.securePlatform.title')}
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-300/70">
                  BTC
                </div>
              </div>
              <div className="relative w-full aspect-square max-w-[520px] mx-auto flex items-center justify-center">
                <div className="text-6xl">₿</div>
              </div>
              <p className="text-sm text-slate-200/80 mt-4 text-center">
                {t('landing.hero.trustIndicators.realTimeData')}
              </p>
            </div>

            {/* Feature highlights */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl shadow-cyan-500/15">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-300/70">
                    {t('landing.hero.trustedBy')}
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {t('landing.hero.features.marketIndicators.title')}
                  </h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-200">
                  {t('landing.hero.features.securePlatform.title')}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl p-4 bg-white/5 border border-white/10 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    <p className="text-sm text-slate-200/80">
                      {t('landing.hero.features.marketIndicators.description')}
                    </p>
                  </div>
                  <div className="h-1 rounded-full bg-gradient-to-r from-emerald-400/80 via-cyan-400/70 to-purple-400/70" />
                </div>

                <div className="rounded-xl p-4 bg-white/5 border border-white/10 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    <p className="text-sm text-slate-200/80">
                      {t(
                        'landing.hero.features.blockchainExplorer.description',
                      )}
                    </p>
                  </div>
                  <div className="h-1 rounded-full bg-gradient-to-r from-cyan-400/80 via-sky-400/70 to-indigo-400/70" />
                </div>

                <div className="rounded-xl p-4 bg-white/5 border border-white/10 flex flex-col gap-2 sm:col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔐</span>
                    <p className="text-sm text-slate-200/80">
                      {t('landing.hero.features.securePlatform.description')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                    {t('landing.hero.trustIndicators.securePlatform')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
