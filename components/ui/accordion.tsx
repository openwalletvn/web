'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionProps {
  type: 'single' | 'multiple'
  collapsible?: boolean
  className?: string
  children: React.ReactNode
}

interface AccordionItemProps {
  value: string
  className?: string
  children: React.ReactNode
}

interface AccordionTriggerProps {
  className?: string
  children: React.ReactNode
}

interface AccordionContentProps {
  children: React.ReactNode
}

const AccordionContext = React.createContext<{
  openItems: string[]
  toggleItem: (value: string) => void
}>({
  openItems: [],
  toggleItem: () => {},
})

const AccordionItemContext = React.createContext<{
  value: string
  isOpen: boolean
}>({
  value: '',
  isOpen: false,
})

export function Accordion({ type, collapsible = false, className = '', children }: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>([])

  const toggleItem = React.useCallback((value: string) => {
    setOpenItems(prev => {
      if (type === 'single') {
        return prev.includes(value) && collapsible ? [] : [value]
      }
      return prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    })
  }, [type, collapsible])

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn('ow-accordion', className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

export function AccordionItem({ value, className = '', children }: AccordionItemProps) {
  const { openItems } = React.useContext(AccordionContext)
  const isOpen = openItems.includes(value)

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div className={cn('ow-accordion-item', className)}>{children}</div>
    </AccordionItemContext.Provider>
  )
}

export function AccordionTrigger({ className = '', children }: AccordionTriggerProps) {
  const { toggleItem } = React.useContext(AccordionContext)
  const { value, isOpen } = React.useContext(AccordionItemContext)

  return (
    <button
      type="button"
      onClick={() => toggleItem(value)}
      className={cn('ow-accordion-trigger flex w-full items-center justify-between', className)}
    >
      {children}
      <ChevronDown
        className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isOpen ? 'rotate-180' : '')}
      />
    </button>
  )
}

export function AccordionContent({ children }: AccordionContentProps) {
  const { isOpen } = React.useContext(AccordionItemContext)

  if (!isOpen) return null

  return (
    <div className="ow-accordion-content overflow-hidden transition-all duration-200">
      {children}
    </div>
  )
}
