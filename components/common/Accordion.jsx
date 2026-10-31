import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * Reusable Accordion component for FAQs and collapsible panels.
 */
export default function Accordion({ items = [], allowMultiple = false, className = '' }) {
  const [openIndices, setOpenIndices] = useState([0])

  const toggleItem = (index) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      )
    } else {
      setOpenIndices((prev) => (prev.includes(index) ? [] : [index]))
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndices.includes(index)
        return (
          <div
            key={index}
            className={`
              rounded-xl border transition-all duration-150 overflow-hidden
              ${isOpen ? 'bg-zinc-900/60 border-zinc-700/80' : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700/60'}
            `}
          >
            <button
              type="button"
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-medium text-zinc-100 focus:outline-none cursor-pointer"
            >
              <span className="text-sm sm:text-base pr-4 font-semibold text-zinc-200">{item.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-zinc-200' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 sm:px-5 pb-5 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800/60 pt-3.5">
                {item.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
