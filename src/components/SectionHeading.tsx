import type { ReactNode } from 'react'
import Reveal from './Reveal'

interface Props {
  eyebrow: string
  title: string
  subtitle?: string
  action?: ReactNode
}

export default function SectionHeading({ eyebrow, title, subtitle, action }: Props) {
  return (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-neon">{eyebrow}</p>
        <h2 className="mt-3 font-display text-2xl font-black uppercase tracking-wide sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
      </div>
      {action}
    </Reveal>
  )
}
