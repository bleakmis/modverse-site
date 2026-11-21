import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Search, SearchX, X } from 'lucide-react'
import { mods } from '@/data/mods'
import { searchMods } from '@/utils/search'
import ModCover from './ModCover'
import Highlight from './Highlight'

interface Props {
  autoFocus?: boolean
  /** Called after the user navigates (to close an overlay, for example). */
  onDone?: () => void
  onEscape?: () => void
  placeholder?: string
}

const MAX_DROPDOWN = 6

/** Live search with a dropdown of results, match highlighting and full keyboard control. */
export default function SearchBar({ autoFocus, onDone, onEscape, placeholder = 'Search mods, categories, features…' }: Props) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(-1)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  const hits = useMemo(() => searchMods(query, mods), [query])
  const shown = hits.slice(0, MAX_DROPDOWN)
  const hasQuery = query.trim().length > 0

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])
  useEffect(() => setActive(-1), [query])

  const go = (to: string) => {
    navigate(to)
    onDone?.()
  }
  const submit = () => {
    if (active >= 0 && shown[active]) go(`/mods/${shown[active].mod.slug}`)
    else if (hasQuery) go(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (shown.length ? (i + 1) % shown.length : -1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (shown.length ? (i <= 0 ? shown.length - 1 : i - 1) : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if (e.key === 'Escape') {
      // In the overlay Esc always closes it; on the /search page it clears the field.
      if (onEscape) onEscape()
      else if (query) setQuery('')
    }
  }

  return (
    <div className="w-full">
      <div className="glass-strong flex items-center gap-3 rounded-2xl px-4 focus-within:border-neon/70 focus-within:shadow-glow">
        <Search size={20} className="shrink-0 text-muted" aria-hidden />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={hasQuery}
          aria-controls={listId}
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          aria-label="Search mods"
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="h-14 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="rounded-lg p-1.5 text-muted hover:text-ink">
            <X size={18} />
          </button>
        )}
      </div>

      {hasQuery && (
        <div id={listId} role="listbox" aria-label="Search results" className="glass-strong mt-3 overflow-hidden rounded-2xl">
          {shown.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-10 text-center" role="status">
              <SearchX size={28} className="text-muted" />
              <p className="font-medium">No mods found for “{query.trim()}”</p>
              <p className="text-sm text-muted">Try a shorter word, a mod name, or a category like “bosses”.</p>
            </div>
          ) : (
            <>
              {shown.map((h, i) => (
                <button
                  key={h.mod.id}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(`/mods/${h.mod.slug}`)}
                  className={`flex w-full items-center gap-3 px-3 py-3 text-left transition ${i === active ? 'bg-neon/10' : ''}`}
                >
                  <ModCover mod={h.mod} className="h-12 w-16 shrink-0 rounded-lg" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-sm font-bold tracking-wide">
                      <Highlight text={h.mod.name} query={query} />
                    </span>
                    <span className="block truncate text-xs text-muted">
                      <Highlight text={h.mod.description} query={query} />
                    </span>
                  </span>
                  <ArrowRight size={16} className="shrink-0 text-muted" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => go(`/search?q=${encodeURIComponent(query.trim())}`)}
                className="flex w-full items-center justify-between border-t border-line/10 px-4 py-3 text-sm font-medium text-neon hover:bg-neon/10"
              >
                See all {hits.length} result{hits.length === 1 ? '' : 's'}
                <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
