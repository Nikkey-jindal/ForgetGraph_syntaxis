import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import Button from '../common/Button'

export default function CtaSection({ onOpenDemoModal }) {
  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-8 sm:p-12 lg:p-16 text-center max-w-4xl mx-auto shadow-sm">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60 mb-5">
            Instant 60-Second Setup
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
            Ready to experience sub-20ms edge performance?
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base mb-8 leading-relaxed max-w-xl mx-auto">
            Deploy your first production site to 45+ global edge hubs today.
            Full scale capabilities unlocked for 14 days without payment credentials.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenDemoModal}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              Start Free 14-Day Trial
            </Button>
            <Link to="/pricing" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Compare Pricing Plans
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero cloud configuration required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-zinc-300" />
              <span>SOC2 Type II compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant TLS & custom domains</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
