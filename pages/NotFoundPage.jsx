import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowRight, AlertCircle } from 'lucide-react'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'

export default function NotFoundPage() {
  return (
    <div className="py-24 sm:py-36 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <Badge variant="default" size="sm" icon={AlertCircle} className="mb-4">
          HTTP 404: Route Not Resolved
        </Badge>
        
        <h1 className="text-6xl sm:text-7xl font-extrabold text-white tracking-tight mb-3 font-mono">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Page not found on edge cluster.
        </h2>

        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-8">
          The requested path does not exist on our global routing mesh. It may have been relocated or entered with an invalid path.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link to="/">
            <Button variant="primary" size="md" icon={Home}>
              Return Home
            </Button>
          </Link>
          <Link to="/features">
            <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
              View Capabilities
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
