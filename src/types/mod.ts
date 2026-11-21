export type CategoryId =
  | 'bosses'
  | 'content'
  | 'magic'
  | 'qol'
  | 'adventure'
  | 'difficulty'
  | 'utility'
  | 'weapons'
  | 'exploration'
  | 'multiplayer'

export interface Category {
  id: CategoryId
  label: string
  blurb: string
}

export interface ExtraLink {
  label: string
  url: string
}

export interface Mod {
  id: string
  slug: string
  name: string
  description: string
  /** Short factual bullet points shown on the mod page. */
  features: string[]
  categories: CategoryId[]
  /** Steam Workshop item ID (verified against the official Workshop page title). */
  workshopId: string
  /** Official Steam Workshop item URL (derived from workshopId). */
  steamUrl: string
  /** Accent hue used for the generated cover until real cover art is added. */
  hue: number
  /** Date the mod was added to the MODVERSE catalog (ISO). Not the mod's release date. */
  addedAt: string
  /** Editor's Choice flag (editorial pick, not a community metric). */
  editorsChoice?: boolean
  /** Extra context shown on the mod page (renames, requirements...). */
  note?: string
  /** Other mods that must be enabled for this one to work. */
  requires?: string[]
  extraLinks?: ExtraLink[]
  // Optional metrics — intentionally absent until verified data exists (Stage 4).
  version?: string
  downloads?: number
  rating?: number
  popularity?: number
}
