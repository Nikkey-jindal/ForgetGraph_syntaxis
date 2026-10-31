import React from 'react'
import { companyStats, trustedCompanies } from '../../data/mockData'

export default function StatsSection() {
  return (
    <section className="py-14 border-y border-zinc-850 bg-zinc-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trusted By Row */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase font-medium tracking-widest text-zinc-500 mb-5">
            Trusted by modern engineering teams worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-50 hover:opacity-80 transition-opacity">
            {trustedCompanies.map((company) => (
              <span
                key={company.name}
                className="font-bold text-sm tracking-wider text-zinc-300 select-none font-mono"
              >
                {company.logoText}
              </span>
            ))}
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-zinc-900">
          {companyStats.map((stat) => (
            <div key={stat.id} className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-850 text-center">
              <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="mt-1 text-xs sm:text-sm font-medium text-zinc-300">{stat.label}</div>
              <div className="mt-1 text-xs text-zinc-500 font-mono">{stat.change}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
