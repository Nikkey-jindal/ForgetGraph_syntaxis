import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Terminal, Activity, Globe, CheckCircle2, ShieldCheck, Zap, Cpu } from 'lucide-react'
import Button from '../common/Button'
import Badge from '../common/Badge'

export default function HeroSection({ onOpenDemoModal }) {
  const [activeTab, setActiveTab] = useState('network')
  const [selectedRegion, setSelectedRegion] = useState('iad')
  const [isWarmingCache, setIsWarmingCache] = useState(false)
  const [warmSuccess, setWarmSuccess] = useState(false)

  const regionDetails = {
    iad: { name: 'US East (Virginia)', code: 'us-east-iad', latency: '11.8ms', hitRate: '99.7%', status: 'Optimal' },
    fra: { name: 'EU Central (Frankfurt)', code: 'eu-central-fra', latency: '14.2ms', hitRate: '99.4%', status: 'Optimal' },
    sin: { name: 'Asia Pacific (Singapore)', code: 'ap-southeast-sin', latency: '18.6ms', hitRate: '98.9%', status: 'Optimal' },
  }

  const handleWarmCache = () => {
    setIsWarmingCache(true)
    setTimeout(() => {
      setIsWarmingCache(false)
      setWarmSuccess(true)
      setTimeout(() => setWarmSuccess(false), 3000)
    }, 800)
  }

  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
      {/* Subtle background technical grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          {/* Release Badge */}
          <div className="mb-5 inline-flex">
            <Badge variant="default" size="md" dot icon={Zap}>
              <span className="font-semibold text-white mr-1">ApexSphere v3.2</span>
              <span>Sub-20ms edge runtime is live</span>
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
            The intelligent edge platform for high-velocity teams.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Deploy, optimize, and scale frontend web applications across 45+ global edge hubs.
            Zero cloud configuration, automated neural caching, and guaranteed sub-20ms latency.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-center mb-10">
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
            <Link to="/features" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Explore Architecture
              </Button>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant Vite & React deployment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-zinc-300" />
              <span>Enterprise SOC2 Type II SLA</span>
            </div>
          </div>
        </div>

        {/* Realistic Interactive Edge Console Mockup */}
        <div className="mx-auto max-w-4xl rounded-xl bg-zinc-900/80 border border-zinc-800 shadow-xl overflow-hidden backdrop-blur-md">
          {/* Header bar with controls & tab switcher */}
          <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950/60 gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block" />
              <span className="ml-2 text-xs font-mono text-zinc-400">edge-cluster-main.apex</span>
            </div>

            {/* Switcher Tabs */}
            <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-0.5 border border-zinc-800 text-xs">
              <button
                onClick={() => setActiveTab('network')}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  activeTab === 'network' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Network Routing
              </button>
              <button
                onClick={() => setActiveTab('metrics')}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  activeTab === 'metrics' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Live Metrics
              </button>
              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  activeTab === 'terminal' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Deployment Log
              </button>
            </div>
          </div>

          {/* Console Viewport */}
          <div className="p-5 sm:p-6 text-xs sm:text-sm">
            {activeTab === 'network' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                  <span className="text-xs font-medium text-zinc-400">Select Global PoP Gateway:</span>
                  <div className="flex items-center gap-1.5">
                    {Object.keys(regionDetails).map((r) => (
                      <button
                        key={r}
                        onClick={() => setSelectedRegion(r)}
                        className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                          selectedRegion === r
                            ? 'bg-zinc-800 text-white border border-zinc-700'
                            : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-transparent'
                        }`}
                      >
                        {r.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
                    <div className="text-zinc-400 text-xs">Active Gateway</div>
                    <div className="text-sm font-semibold text-white mt-1">{regionDetails[selectedRegion].name}</div>
                    <div className="text-[11px] font-mono text-zinc-500 mt-0.5">{regionDetails[selectedRegion].code}</div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
                    <div className="text-zinc-400 text-xs">Roundtrip Latency</div>
                    <div className="text-sm font-semibold text-white mt-1">{regionDetails[selectedRegion].latency}</div>
                    <div className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                      Sub-20ms SLA Verified
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
                    <div className="text-zinc-400 text-xs">Cache Hit Efficiency</div>
                    <div className="text-sm font-semibold text-white mt-1">{regionDetails[selectedRegion].hitRate}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">Neural Prefetch On</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-zinc-950/90 border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Dynamic Neural Cache Synced</div>
                      <div className="text-[11px] text-zinc-400">Autonomous invalidation active across all nodes</div>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleWarmCache}
                    disabled={isWarmingCache}
                    className="text-xs"
                  >
                    {isWarmingCache ? 'Triggering...' : warmSuccess ? 'Warmed 100%' : 'Trigger Cache Warm'}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-400 text-xs">Edge Requests / sec</span>
                  <div className="text-xl font-bold text-white mt-1">48,290</div>
                  <span className="text-emerald-400 text-[11px] font-medium">+12.4% vs median</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-400 text-xs">P99 Global Latency</span>
                  <div className="text-xl font-bold text-white mt-1">16.4ms</div>
                  <span className="text-emerald-400 text-[11px] font-medium">Optimal</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-400 text-xs">Global Cache Ratio</span>
                  <div className="text-xl font-bold text-white mt-1">99.6%</div>
                  <span className="text-zinc-400 text-[11px]">Hit rate</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-400 text-xs">Uptime SLA</span>
                  <div className="text-xl font-bold text-white mt-1">99.999%</div>
                  <span className="text-emerald-400 text-[11px]">Zero incidents</span>
                </div>
              </div>
            )}

            {activeTab === 'terminal' && (
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs space-y-1.5 text-zinc-300">
                <div className="text-zinc-500">$ apex deploy --production --env=prod</div>
                <div className="text-zinc-400">&gt; Vite production bundle compiled in 418ms</div>
                <div className="text-zinc-400">&gt; Distributed to 45 global edge regions</div>
                <div className="text-emerald-400">&gt; Live at https://app.apexsphere.io (SSL verified)</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
