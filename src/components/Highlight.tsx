import { tokenize, tokenPattern } from '@/utils/search'

/** Renders text with every search-word match highlighted. */
export default function Highlight({ text, query }: { text: string; query?: string }) {
  const tokens = query ? tokenize(query) : []
  if (!tokens.length) return <>{text}</>
  const re = new RegExp(`(${tokens.map(tokenPattern).join('|')})`, 'gi')
  const parts = text.split(re)
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded bg-neon/25 px-0.5 text-inherit">
            {p}
          </mark>
        ) : (
          p
        ),
      )}
    </>
  )
}
