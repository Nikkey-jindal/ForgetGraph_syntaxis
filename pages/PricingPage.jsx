import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Check, X, Zap } from 'lucide-react'
import SectionHeader from '../components/common/SectionHeader'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import Accordion from '../components/common/Accordion'
import { pricingPlans, faqs } from '../data/mockData'

export default function PricingPage() {
  const { onOpenDemoModal } = useOutletContext()
  const [isYearly, setIsYearly] = useState(true)

  const comparisonFeatures = [
    { name: 'Global Edge Locations', starter: '15 Locations', pro: '45+ Locations', enterprise: '300+ Custom PoPs' },
    { name: 'Monthly Edge Requests', starter: '50,000 / mo', pro: '1,000,000 / mo', enterprise: 'Unlimited High-Bandwidth' },
    { name: 'Neural Cache Invalidation', starter: false, pro: true, enterprise: true },
    { name: 'Canary Rollout Engine', starter: false, pro: true, enterprise: true },
    { name: 'Automated TLS & Domains', starter: true, pro: true, enterprise: true },
    { name: 'SLA Uptime Guarantee', starter: '99.9%', pro: '99.99%', enterprise: '99.999% SLA' },
    { name: 'SOC2 & HIPAA Compliance', starter: false, pro: 'SOC2 Type II', enterprise: 'SOC2, HIPAA, ISO27001' },
    { name: 'Dedicated Solutions Architect', starter: false, pro: false, enterprise: true },
    { name: '24/7 Phone & Slack Support', starter: false, pro: true, enterprise: true },
  ]

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Predictable Pricing"
          badgeIcon={Zap}
          title="Transparent pricing that scales with your traffic."
          subtitle="Start with a free 14-day trial. Scale from your initial prototype to enterprise global scale without hidden surcharges."
        />

        {/* Monthly / Annual Toggle */}
        <div className="flex items-center justify-center gap-3.5 mb-14">
          <span className={`text-xs font-medium ${!isYearly ? 'text-white' : 'text-zinc-400'}`}>
            Monthly Billing
          </span>
          <button
            type="button"
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-12 h-6 rounded-full bg-zinc-800 border border-zinc-700 p-0.5 cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-400"
            aria-label="Toggle annual billing discount"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-150 ${
                isYearly ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${isYearly ? 'text-white' : 'text-zinc-400'}`}>
              Annual Billing
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
              Save 20%
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-20">
          {pricingPlans.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
            return (
              <Card
                key={plan.id}
                className={`flex flex-col justify-between ${
                  plan.popular ? 'border-zinc-700 bg-zinc-900/80 shadow-md' : 'bg-zinc-900/40'
                }`}
              >
                <div>
                  {plan.popular && (
                    <div className="mb-4">
                      <Badge variant="emerald" size="sm" dot>
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1.5 min-h-[32px] leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-zinc-800">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white">${price}</span>
                    <span className="text-xs font-medium text-zinc-400">/ month</span>
                    {isYearly && <span className="text-[11px] text-zinc-500 ml-1.5">(billed annually)</span>}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                      Included Capabilities:
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant={plan.popular ? 'primary' : 'secondary'}
                  size="md"
                  fullWidth
                  onClick={onOpenDemoModal}
                >
                  {plan.cta}
                </Button>
              </Card>
            )
          })}
        </div>

        {/* Detailed Comparison Table */}
        <div className="rounded-xl bg-zinc-900/40 border border-zinc-800 p-5 sm:p-8 mb-20 overflow-x-auto">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Full Feature Comparison Matrix</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Compare architectural limits and enterprise provisions side-by-side.
            </p>
          </div>

          <table className="w-full text-left border-collapse text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase font-semibold">
                <th className="py-3 pr-4">Feature & Architecture</th>
                <th className="py-3 px-3 text-center">Starter</th>
                <th className="py-3 px-3 text-center text-zinc-200 font-bold">Pro</th>
                <th className="py-3 pl-3 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {comparisonFeatures.map((row, i) => (
                <tr key={i} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3.5 pr-4 font-medium text-white">{row.name}</td>
                  <td className="py-3.5 px-3 text-center">
                    {typeof row.starter === 'boolean' ? (
                      row.starter ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-zinc-600 mx-auto" />
                      )
                    ) : (
                      row.starter
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center font-semibold text-zinc-100 bg-zinc-900/30">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-zinc-600 mx-auto" />
                      )
                    ) : (
                      row.pro
                    )}
                  </td>
                  <td className="py-3.5 pl-3 text-center text-zinc-300">
                    {typeof row.enterprise === 'boolean' ? (
                      row.enterprise ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-zinc-600 mx-auto" />
                      )
                    ) : (
                      row.enterprise
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing FAQs */}
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            badge="Billing FAQ"
            title="Common questions regarding plans & quotas."
            subtitle="Straightforward details about contracts, usage upgrades, and trial periods."
          />
          <Accordion items={faqs} />
        </div>
      </div>
    </div>
  )
}
