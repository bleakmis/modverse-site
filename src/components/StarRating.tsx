import { useState } from 'react'
import { Star } from 'lucide-react'

/** Read-only stars. `value` undefined renders empty stars. */
export function StarDisplay({ value, size = 16 }: { value?: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={value ? `${value} out of 5 stars` : 'Not rated'}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={value && n <= value ? 'fill-amber-400 text-amber-400' : 'text-muted/50'} />
      ))}
    </span>
  )
}

interface Props {
  value?: number
  onChange: (value: number) => void
  size?: number
}

/** Interactive 1–5 star input (radio group, keyboard accessible, hover preview). */
export default function StarRating({ value, onChange, size = 30 }: Props) {
  const [hover, setHover] = useState(0)
  const shown = hover || value || 0

  return (
    <div role="radiogroup" aria-label="Your rating" className="inline-flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => setHover(n)}
          onFocus={() => setHover(n)}
          onBlur={() => setHover(0)}
          onClick={() => onChange(n)}
          className="rounded-md p-0.5 transition hover:scale-125"
        >
          <Star size={size} className={n <= shown ? 'fill-amber-400 text-amber-400' : 'text-muted/50'} />
        </button>
      ))}
    </div>
  )
}
