import React from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Cpu,
  Globe,
  ShieldCheck,
  Terminal,
  CheckCircle2,
  ArrowRight,
  Zap,
  Server,
  Layers,
} from 'lucide-react'
import SectionHeader from '../components/common/SectionHeader'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import Accordion from '../components/common/Accordion'
import { coreFeatures, faqs } from '../data/mockData'

export default function FeaturesPage() {
  const { onOpenDemoModal } = useOutletContext()

  const architectureSteps = [
    {
      step: '01',
      title: 'Automated Ingestion',
      desc: 'Push code via Git or CLI. ApexSphere builds, optimizes, and compresses assets with modern Vite-powered compilers in under 5 seconds.',
    },
    {
      step: '02',
      title: 'Global Mesh Distribution',
      desc: 'Artifacts are encrypted and synchronized globally across 45+ premier tier-1 data hubs with instant atomic consistency.',
    },
    {
      step: '03',
      title: 'Neural Edge Execution',
      desc: 'Inbound requests route to the geographically optimal node. Edge compute and dynamic cache synthesis respond in sub-20ms.',
    },
    {
      step: '04',
      title: 'Zero-Overhead Tracing',
      desc: 'Observability telemetry streams asynchronously to centralized dashboards without imposing any client or server latency tax.',
    },
  ]

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          badge="Product Capabilities"
          badgeIcon={Zap}
          title="Engineered for mission-critical web applications."
          subtitle="Explore the engineering principles, distributed architecture, and neural performance features powering ApexSphere."
        />

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {coreFeatures.map((feature, i) => (
            <Card key={feature.id}>
              <div className="flex items-center justify-between mb-4">
                <Badge variant={i % 2 === 0 ? 'default' : 'indigo'} size="sm">
                  {feature.category}
                </Badge>
                <span className="text-[11px] font-mono text-zinc-500">SPEC-0{i + 1}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                {feature.description}
              </p>
              <div className="pt-3.5 border-t border-zinc-800 flex items-center gap-2 text-xs font-medium text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{feature.highlight}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Technical Pipeline Section */}
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-10 mb-20">
          <div className="max-w-xl mb-10">
            <Badge variant="default" size="sm" icon={Layers} className="mb-3">
              Technical Pipeline
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              How requests are routed and answered in sub-20ms
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {architectureSteps.map((step) => (
              <div
                key={step.step}
                className="p-5 rounded-xl bg-zinc-950/70 border border-zinc-850 hover:border-zinc-700/80 transition-colors"
              >
                <span className="text-2xl font-black text-zinc-600 font-mono block">
                  {step.step}
                </span>
                <h4 className="text-sm font-semibold text-white mt-2 mb-1.5">{step.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-zinc-400">
              Need custom VPC peering or hybrid on-premises edge clusters?
            </span>
            <Button variant="secondary" size="sm" onClick={onOpenDemoModal}>
              Speak with Infrastructure Architect
            </Button>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            badge="Frequently Asked Questions"
            title="Common questions regarding architecture and SLAs."
            subtitle="Straightforward answers about our global mesh, reliability guarantees, and zero-downtime rollouts."
          />
          <Accordion items={faqs} />
        </div>
      </div>
    </div>
  )
}
