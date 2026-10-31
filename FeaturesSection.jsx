import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Globe, Cpu, ShieldCheck, Terminal, Zap, BarChart3, ArrowRight } from 'lucide-react'
import SectionHeader from '../common/SectionHeader'
import Card from '../common/Card'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { coreFeatures } from '../../data/mockData'

export default function FeaturesSection() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'AI & ML', 'Infrastructure', 'Security', 'Developer Tools']

  const filteredFeatures =
    selectedCategory === 'All'
      ? coreFeatures
      : coreFeatures.filter((f) => f.category === selectedCategory)

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'AI & ML':
        return Cpu
      case 'Infrastructure':
        return Globe
      case 'Security':
        return ShieldCheck
      case 'Developer Tools':
        return Terminal
      default:
        return Zap
    }
  }

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Engineered for Precision"
          badgeIcon={Zap}
          title="Architecture built for high-scale frontend workloads."
          subtitle="Everything required to run mission-critical web applications with instant global responses and zero operational overhead."
        />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                  : 'bg-zinc-900/40 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFeatures.map((feature) => {
            const Icon = getCategoryIcon(feature.category)
            return (
              <Card key={feature.id} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <Badge variant={feature.badge === 'Flagship' ? 'emerald' : 'default'} size="sm">
                      {feature.badge}
                    </Badge>
                  </div>

                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                    {feature.category}
                  </span>
                  <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    {feature.highlight}
                  </span>
                  <Link
                    to="/features"
                    className="text-xs text-zinc-400 hover:text-white font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    Specifications &rarr;
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Section Action Button */}
        <div className="mt-12 text-center">
          <Link to="/features">
            <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
              View Complete Architectural Specifications
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
