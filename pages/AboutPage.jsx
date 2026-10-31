import React from 'react'
import { Rocket, ShieldCheck, Lightbulb, Heart, Globe, Users } from 'lucide-react'
import SectionHeader from '../components/common/SectionHeader'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import { teamMembers } from '../data/mockData'

export default function AboutPage() {
  const values = [
    {
      icon: Rocket,
      title: 'Velocity Without Regression',
      description: 'We believe engineering teams should ship multiple times per hour without risking outages, latency spikes, or cloud regressions.',
    },
    {
      icon: ShieldCheck,
      title: 'Zero-Trust By Default',
      description: 'Security is not an add-on checklist. It is compiled directly into the runtime fabric of every network packet and edge function.',
    },
    {
      icon: Lightbulb,
      title: 'Radical Simplicity',
      description: 'The best developer tooling is invisible. Complex distributed architectures should present an elegant, friction-free developer experience.',
    },
    {
      icon: Heart,
      title: 'Developer Obsession',
      description: 'We measure our impact solely by the friction, operational overhead, and latency we eliminate for software engineers.',
    },
  ]

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          badge="Company & Mission"
          badgeIcon={Globe}
          title="Empowering developers to build for a borderless web."
          subtitle="We are a team of distributed systems specialists, compiler creators, and infrastructure engineers establishing the next runtime standard."
        />

        {/* Narrative & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
          <div className="space-y-5">
            <Badge variant="default" size="sm">
              Founded in 2024
            </Badge>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              Reimagining the web runtime from the edge inward.
            </h3>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Modern frontend applications have grown increasingly powerful, yet traditional cloud
              providers forced developers to choose between centralized servers with high latency or fragile, complex edge toolchains.
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              ApexSphere was created to eliminate that compromise. By pairing autonomous neural caching
              with ultra-low-latency edge nodes, we enable developers to deploy globally with zero configuration and total confidence.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center justify-center font-bold text-sm">
                45+
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Global Tier-1 Data Hubs</h4>
                <p className="text-xs text-zinc-400">Direct peering at all major continental internet exchanges.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center justify-center font-bold text-sm">
                2.4B
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Daily Edge Requests</h4>
                <p className="text-xs text-zinc-400">Serving sub-20ms responses with 99.999% verified reliability.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-emerald-400 flex items-center justify-center font-bold text-sm">
                18ms
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Worldwide P90 Latency</h4>
                <p className="text-xs text-zinc-400">Validated continuously by independent synthetic monitoring.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Engineering Principles</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1.5">
              The foundational values that guide our architecture, pull requests, and roadmap decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((val, i) => {
              const Icon = val.icon
              return (
                <Card key={i} className="flex flex-col">
                  <div className="w-9 h-9 rounded-lg bg-zinc-850 border border-zinc-750 text-zinc-300 flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1.5">{val.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{val.description}</p>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Leadership & Engineering Team */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <Badge variant="default" size="sm" icon={Users} className="mb-2">
              Leadership
            </Badge>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Meet the Team</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Seasoned specialists in distributed systems, compilers, web standards, and developer platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {teamMembers.map((member, i) => (
              <Card key={i} className="text-center flex flex-col items-center">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-20 h-20 rounded-xl object-cover mb-3.5 border border-zinc-700 shadow-sm"
                />
                <h4 className="text-sm font-semibold text-white">{member.name}</h4>
                <p className="text-xs text-zinc-400 font-medium mb-2">{member.role}</p>
                <p className="text-xs text-zinc-500 leading-relaxed">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
