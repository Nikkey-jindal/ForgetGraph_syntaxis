import React, { useState } from 'react'
import {
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import SectionHeader from '../components/common/SectionHeader'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Technical Architecture Question',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 900)
  }

  const contactChannels = [
    {
      icon: Mail,
      title: 'Engineering Inquiries',
      desc: 'Technical questions regarding edge routing, custom cache rules, and SLAs.',
      actionText: 'support@apexsphere.io',
      actionHref: 'mailto:support@apexsphere.io',
    },
    {
      icon: MessageSquare,
      title: 'Developer Community',
      desc: 'Join 14,000+ developers chatting on our community Discord.',
      actionText: 'discord.gg/apexsphere',
      actionHref: '#',
    },
    {
      icon: Phone,
      title: 'Enterprise Line',
      desc: 'Dedicated phone line for 99.999% SLA enterprise accounts.',
      actionText: '+1 (800) 555-APEX',
      actionHref: 'tel:+18005552739',
    },
    {
      icon: MapPin,
      title: 'San Francisco HQ',
      desc: '500 Howard Street, Suite 400, San Francisco, CA 94105',
      actionText: 'View on Maps',
      actionHref: '#',
    },
  ]

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Direct Engineering Channel"
          badgeIcon={Mail}
          title="Connect with our systems engineering team."
          subtitle="Have questions about migrating high-concurrency traffic or custom enterprise agreements? We typically respond within hours."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
          {/* Contact Details & Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">We're here to assist</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Whether deploying your first React application or shifting thousands of edge requests per second, our engineering team is readily accessible.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              {contactChannels.map((channel, idx) => {
                const Icon = channel.icon
                return (
                  <Card key={idx} padding="p-4" className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-xs sm:text-sm">{channel.title}</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{channel.desc}</p>
                      <a
                        href={channel.actionHref}
                        className="text-xs text-zinc-300 hover:text-white font-medium mt-1.5 inline-block transition-colors"
                      >
                        {channel.actionText} &rarr;
                      </a>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <Card padding="p-6 sm:p-8">
              {submitted ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Message Transmitted</h3>
                  <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you, <span className="text-zinc-200 font-medium">{formData.name}</span>. An engineer has been routed your message and will reply at{' '}
                    <span className="text-zinc-200 font-medium">{formData.email}</span>.
                  </p>
                  <div className="pt-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSubmitted(false)
                        setFormData({
                          name: '',
                          email: '',
                          subject: 'Technical Architecture Question',
                          message: '',
                        })
                      }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Your Name <span className="text-zinc-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alex Rivera"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Work Email <span className="text-zinc-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@company.com"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                    >
                      <option value="Technical Architecture Question">Technical Architecture Question</option>
                      <option value="Enterprise SLA & Custom Quota">Enterprise SLA & Custom Quota</option>
                      <option value="Security & Compliance Review">Security & Compliance Review</option>
                      <option value="Partnership & Integration">Partnership & Integration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Project Scope & Details <span className="text-zinc-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline your frontend architecture, current latency goals, and expected request volume..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-1">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      fullWidth
                      disabled={loading}
                      icon={ArrowRight}
                      iconPosition="right"
                    >
                      {loading ? 'Submitting...' : 'Send Inquiry'}
                    </Button>
                  </div>

                  <p className="text-[11px] text-center text-zinc-500">
                    Encrypted with zero-trust protocols. Your information is confidential.
                  </p>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
