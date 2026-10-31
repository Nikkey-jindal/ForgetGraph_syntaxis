import React from 'react'
import { Star, MessageSquare } from 'lucide-react'
import SectionHeader from '../common/SectionHeader'
import Card from '../common/Card'
import { testimonials } from '../../data/mockData'

export default function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Customer Validation"
          badgeIcon={MessageSquare}
          title="Engineers shipping faster, every day."
          subtitle="Discover how technical leaders utilize ApexSphere to reduce latency, lower cloud bills, and eliminate deployment anxiety."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between">
              <div>
                {/* 5-star ratings */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  "{item.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                />
                <div>
                  <h4 className="font-semibold text-white text-xs sm:text-sm">{item.author}</h4>
                  <p className="text-[11px] text-zinc-400">{item.role}</p>
                  <p className="text-[11px] text-zinc-500">{item.company}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
