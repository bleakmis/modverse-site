import { Scale } from 'lucide-react'
import type { Mod } from '@/types/mod'
import { useModActions } from '@/hooks/useModActions'

export default function CompareButton({ mod, labeled = false }: { mod: Mod; labeled?: boolean }) {
  const { isComparing, toggleCompare } = useModActions()
  const active = isComparing(mod.id)
  return (
    <button
      type="button"
      onClick={() => toggleCompare(mod)}
      aria-pressed={active}
      aria-label={active ? `Remove ${mod.name} from compare` : `Add ${mod.name} to compare`}
      className={`btn glass ${labeled ? '' : '!px-3.5'} ${active ? 'border-neon/70 text-neon' : 'text-ink hover:border-neon/60 hover:text-neon'}`}
    >
      <Scale size={16} />
      {labeled && (active ? 'In compare' : 'Compare')}
    </button>
  )
}
