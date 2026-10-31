import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, Layers } from 'lucide-react'
import Button from '../common/Button'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email && email.includes('@')) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  const footerNavigation = {
    product: [
      { name: 'AI Optimization', href: '/features' },
      { name: 'Global Edge Fabric', href: '/features' },
      { name: 'Observability & Logs', href: '/features' },
      { name: 'Pricing Tiers', href: '/pricing' },
      { name: 'Releases & Changelog', href: '/features' },
    ],
    company: [
      { name: 'About ApexSphere', href: '/about' },
      { name: 'Engineering Team', href: '/about' },
      { name: 'Core Principles', href: '/about' },
      { name: 'Contact Engineering', href: '/contact' },
    ],
    resources: [
      { name: 'Documentation', href: '/features' },
      { name: 'Architecture Overview', href: '/features' },
      { name: 'API Reference', href: '/features' },
      { name: 'Community Channels', href: '/contact' },
    ],
    compliance: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Security & SOC2', href: '#' },
      { name: 'Status Dashboard', href: '#' },
    ],
  }

  return (
    <footer className="border-t border-zinc-850/80 bg-zinc-950/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-zinc-850">
          {/* Brand info & newsletter column */}
          <div className="lg:col-span-5 space-y-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-zinc-100">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">ApexSphere</span>
            </Link>
            
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              The modern intelligent cloud runtime built for high-performance frontend applications.
              Deploy instantly, optimize autonomously, and scale with sub-20ms edge precision.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs font-medium text-zinc-300 mb-2">Subscribe to Architectural Updates</p>
              
              {subscribed ? (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You're subscribed to developer updates.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                  <Button type="submit" variant="secondary" size="sm" icon={ArrowRight} iconPosition="right">
                    Join
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3.5">Product</h3>
              <ul className="space-y-2.5">
                {footerNavigation.product.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3.5">Company</h3>
              <ul className="space-y-2.5">
                {footerNavigation.company.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3.5">Resources</h3>
              <ul className="space-y-2.5">
                {footerNavigation.resources.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3.5">Compliance</h3>
              <ul className="space-y-2.5">
                {footerNavigation.compliance.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal notices */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} ApexSphere Technologies Inc. Built with React & Tailwind CSS.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              All Systems Operational
            </span>
            <span>SOC2 Type II Certified</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
