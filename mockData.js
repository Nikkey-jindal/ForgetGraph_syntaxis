export const companyStats = [
  { id: 'stat-1', label: 'Global Active Users', value: '2.4M+', change: '+24% YoY' },
  { id: 'stat-2', label: 'Average Response Time', value: '18ms', change: '99.99% Uptime' },
  { id: 'stat-3', label: 'Cloud Infrastructure', value: '45+', change: 'Edge Regions' },
  { id: 'stat-4', label: 'Customer Retention Rate', value: '98.7%', change: 'Enterprise Rated' },
]

export const trustedCompanies = [
  { name: 'Vanguard', logoText: 'VANGUARD' },
  { name: 'HyperScale', logoText: 'HYPERSCALE' },
  { name: 'NovaCore', logoText: 'NOVA.CORE' },
  { name: 'AeroCloud', logoText: 'AEROCLOUD' },
  { name: 'PulseLab', logoText: 'PULSE LABS' },
  { name: 'Synthetix', logoText: 'SYNTHETIX' },
]

export const coreFeatures = [
  {
    id: 'ai-engine',
    title: 'Adaptive AI Optimization',
    category: 'AI & ML',
    description: 'Autonomous neural pipelines that predict traffic surges, optimize workloads, and eliminate latency bottlenecks in real time.',
    badge: 'Flagship',
    highlight: 'Up to 4.2x Faster Rendering',
  },
  {
    id: 'edge-network',
    title: 'Multi-Region Edge Fabric',
    category: 'Infrastructure',
    description: 'Deploy code instantly to 300+ edge points of presence across 45 countries with sub-20ms round-trip latency guaranteed.',
    badge: 'Global',
    highlight: 'Sub-20ms Global Latency',
  },
  {
    id: 'security-shield',
    title: 'Zero-Trust Defense Architecture',
    category: 'Security',
    description: 'Continuous cryptographic verification, automated vulnerability mitigations, and compliance with SOC2 Type II, ISO 27001, and HIPAA.',
    badge: 'Enterprise',
    highlight: 'Zero-Day Automated Isolation',
  },
  {
    id: 'observability',
    title: 'Full-Spectrum Observability',
    category: 'Developer Tools',
    description: 'Unified distributed tracing, real-user metrics, query inspection, and automated anomaly root-cause detection in one glass dashboard.',
    badge: 'Real-Time',
    highlight: 'Millisecond Metric Resolution',
  },
  {
    id: 'instant-deploy',
    title: 'Zero-Downtime Rollouts',
    category: 'Infrastructure',
    description: 'Atomic git-triggered deployments with instant instant rollback checkpoints and automated smoke verification.',
    badge: 'DevOps',
    highlight: 'Instant Canary Releases',
  },
  {
    id: 'smart-scaling',
    title: 'Autonomous Serverless Scaling',
    category: 'AI & ML',
    description: 'Automatically adjust compute allocations from zero to millions of requests with pay-as-you-go elastic billing.',
    badge: 'Efficient',
    highlight: 'Scale to 0 Cost Efficiency',
  },
]

export const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter Developer',
    description: 'Ideal for indie hackers, founders, and prototype products requiring fast launch speeds.',
    monthlyPrice: 19,
    yearlyPrice: 15,
    popular: false,
    cta: 'Start Free Trial',
    features: [
      'Up to 3 Active Production Sites',
      '50,000 Edge Requests / month',
      'Community Support & Documentation',
      'Automated SSL & Custom Domains',
      'Shared Edge Caching Layer',
      'Basic Performance Analytics',
    ],
  },
  {
    id: 'pro',
    name: 'Scale & Growth',
    description: 'For growing startups and scaling teams that require peak performance, insights, and SLAs.',
    monthlyPrice: 69,
    yearlyPrice: 55,
    popular: true,
    cta: 'Launch with Pro',
    features: [
      'Unlimited Production Deployments',
      '1,000,000 Edge Requests / month',
      'Priority 24/7 Slack & Email Support',
      'Custom Edge Routing & Middleware',
      'Advanced Anomaly Detection',
      'Team RBAC & Multi-seat Access',
      'Automated Canary Deployments',
      'SOC2 Ready Audit Logging',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Ultra',
    description: 'Dedicated infrastructure, custom SLAs, tailor-made compliance, and white-glove engineering support.',
    monthlyPrice: 249,
    yearlyPrice: 199,
    popular: false,
    cta: 'Contact Sales',
    features: [
      'Dedicated Custom Private Clusters',
      'Unmetered High-Bandwidth Edge Access',
      '99.999% SLA Uptime Guarantee',
      'Dedicated Customer Success Architect',
      'Custom Single Sign-On (SAML / Okta)',
      'Custom On-Premise Gateway Options',
      'Real-Time Penetration Defenses',
      'Custom Billing & Contract Terms',
    ],
  },
]

export const testimonials = [
  {
    id: 'test-1',
    author: 'Elena Rostova',
    role: 'VP of Engineering',
    company: 'FinPulse Systems',
    content: 'ApexSphere delivered a 300% performance boost to our high-frequency dashboard within 48 hours of migration. The developer experience is unmatched.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'test-2',
    author: 'Marcus Chen',
    role: 'Founder & CTO',
    company: 'QuantumSync',
    content: 'The zero-trust edge protection and instantaneous canary rollbacks allowed our team of 15 engineers to ship 40+ times per week without a single outage.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'test-3',
    author: 'Sophia Sterling',
    role: 'Chief Product Officer',
    company: 'OrbitWave Media',
    content: 'Switching our front-end infrastructure to this platform reduced our bounce rate by 22% and saved our team tens of thousands in cloud compute bills.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
]

export const faqs = [
  {
    question: 'How simple is the migration from existing Next.js or Vite setups?',
    answer: 'Migration takes under 15 minutes. Our CLI recognizes your existing bundler configurations, routes, and environment variables automatically without requiring code rewrites.',
  },
  {
    question: 'What is included in the 14-day free trial?',
    answer: 'Every feature of our Scale & Growth (Pro) tier is fully accessible during the trial, including unlimited edge requests, continuous canary testing, and team invitations. No credit card is required to begin.',
  },
  {
    question: 'Can I connect custom domain names and manage SSL certificates?',
    answer: 'Yes! Automated TLS/SSL certificate issuance and renewal via Let’s Encrypt is provisioned within 60 seconds of adding your DNS records.',
  },
  {
    question: 'How do you achieve sub-20ms global latency?',
    answer: 'We utilize an edge mesh network topology located in 45+ premier tier-1 data hubs worldwide. Static assets, edge functions, and cached API responses execute in the node geographically closest to each user.',
  },
  {
    question: 'Do you offer custom Enterprise agreements and custom DPAs?',
    answer: 'Yes, our enterprise tier includes bespoke Data Processing Agreements (DPA), Business Associate Agreements (BAA for HIPAA), custom SLAs, and custom invoicing cycles.',
  },
]

export const teamMembers = [
  {
    name: 'Dr. Evelyn Cross',
    role: 'Co-Founder & Chief Executive Officer',
    bio: 'Former distributed systems research lead at Stanford with 15+ years architecting high-throughput cloud networks.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Julian Vance',
    role: 'Co-Founder & Chief Technology Officer',
    bio: 'Pioneer in edge computing runtime design; author of multiple open-source web compiler toolchains.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Amina Nour',
    role: 'Head of Developer Experience',
    bio: 'Passionate about frontend performance, intuitive developer tooling, and community-driven engineering.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Liam Gallagher',
    role: 'Head of Global Security & Compliance',
    bio: 'Specialist in offensive cybersecurity, zero-trust architectures, and automated cloud compliance systems.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
  },
]
