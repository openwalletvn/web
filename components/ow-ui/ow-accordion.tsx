'use client'

import * as React from 'react'
import {Accordion} from 'radix-ui'
import {ChevronDown} from 'lucide-react'
import {cn} from '@/lib/utils'

interface OwAccordionItem {
  value: string
  trigger: React.ReactNode
  content: React.ReactNode
}

interface OwAccordionProps {
  items: OwAccordionItem[]
  type?: 'single' | 'multiple'
  collapsible?: boolean
  defaultValue?: string | string[]
  className?: string
}

export function OwAccordion({ items, type = 'single', collapsible = true, defaultValue, className }: OwAccordionProps) {
  const sharedProps = {className: cn('ow-accordion divide-y divide-border space-y-4', className)}

  const renderItems = () =>
    items.map((item) => (
      <Accordion.Item key={item.value} value={item.value}
                      className="ow-accordion-item border-none bg-bg-warm rounded-lg border border-bg-warm sm:p-6 p-3">
        <Accordion.Header asChild>
          <Accordion.Trigger
            className="ow-accordion-trigger group flex w-full cursor-pointer items-center justify-between gap-4 text-left font-medium text-text-primary transition-colors hover:text-text-accent [&[data-state=open]>svg]:rotate-180">
            <span className="heading-5">{item.trigger}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-text-muted transition-transform duration-200" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="ow-accordion-content overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="sm:pt-4 sm:mt-4 pt-3 mt-3 border-t border-text-muted/20">
            <div className="max-w-4xl">
              {item.content}
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    ))

  if (type === 'multiple') {
    return (
      <Accordion.Root type="multiple" defaultValue={Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : undefined} {...sharedProps}>
        {renderItems()}
      </Accordion.Root>
    )
  }

  return (
    <Accordion.Root type="single" collapsible={collapsible} defaultValue={Array.isArray(defaultValue) ? defaultValue[0] : defaultValue} {...sharedProps}>
      {renderItems()}
    </Accordion.Root>
  )
}
