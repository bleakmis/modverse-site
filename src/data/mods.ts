import type { Mod } from '@/types/mod'
import { workshopItemUrl } from '@/utils/steam'

/**
 * Local mod database.
 * - Workshop IDs were verified against the official Steam Workshop page titles (Nov 2026).
 * - No ratings / downloads / versions are shown: Workshop versions change often and were not reliably
 *   verifiable, so those fields stay undefined until a data source (API / Supabase) exists.
 * - Descriptions and features only state facts confirmed from the Workshop pages and changelogs.
 * - Swap this module for an API call later without changing consumers (see utils/catalog.ts).
 */
type Seed = Omit<Mod, 'steamUrl' | 'addedAt'>

const ADDED = '2026-11-17'
const make = (m: Seed): Mod => ({ ...m, steamUrl: workshopItemUrl(m.workshopId), addedAt: ADDED })

export const mods: Mod[] = [
  make({
    id: 'calamity',
    slug: 'calamity-mod',
    name: 'Calamity Mod',
    workshopId: '2824688072',
    description:
      'A very large content mod that adds new bosses, biomes, enemies, weapons and difficulty modes, extending the game far beyond vanilla progression.',
    features: [
      'New bosses and enemies across the whole progression',
      'Revengeance and Death difficulty modes',
      'Large new arsenal of weapons and gear',
    ],
    categories: ['bosses', 'content', 'difficulty', 'weapons'],
    hue: 350,
    editorsChoice: true,
    note: 'Many add-ons exist for Calamity (for example Infernum Mode and a Fargo\'s Souls DLC) — they require this mod.',
  }),
  make({
    id: 'thorium',
    slug: 'thorium-mod',
    name: 'Thorium Mod',
    workshopId: '2909886416',
    description:
      'Adds the bard and healer classes alongside new bosses, items and progression, with detailed documentation on the Thorium Mod Wiki.',
    features: ['New Bard and Healer classes', 'New bosses, including Grand Thunder Bird', 'Maintained wiki with full details'],
    categories: ['content', 'bosses', 'weapons'],
    hue: 190,
    editorsChoice: true,
  }),
  make({
    id: 'fargos-souls',
    slug: 'fargos-souls-mod',
    name: "Fargo's Souls Mod",
    workshopId: '2815540735',
    description:
      'Known for its Enchantment, Force and Soul accessory system, plus the Eternity and Masochist difficulty modes and the Mutant boss.',
    features: [
      'Enchantments combine into Forces and Souls',
      'Eternity and Masochist difficulty modes',
      'The Mutant boss',
      'A separate DLC exists for Calamity Mod',
    ],
    categories: ['content', 'difficulty', 'weapons'],
    hue: 280,
  }),
  make({
    id: 'redemption',
    slug: 'mod-of-redemption',
    name: 'Mod of Redemption',
    workshopId: '2893332653',
    description:
      'A story-driven expansion with the Spirit Realm, Wasteland and an Abandoned Lab, new town NPCs, new bosses and an elemental damage system.',
    features: [
      'Spirit Realm, Wasteland and Abandoned Lab areas',
      'New town NPCs and bosses',
      'Elemental damage system',
    ],
    categories: ['adventure', 'bosses', 'content', 'exploration'],
    hue: 40,
    note: 'Listed on the Workshop as "Mod of Redemption [BETA]".',
  }),
  make({
    id: 'spirit',
    slug: 'spirit-mod',
    name: 'Spirit Mod',
    workshopId: '2982372319',
    description:
      'A content mod with the Spirit biome and its enemies, new bosses such as Scarabeus and Atlas, and a large set of weapons and gear.',
    features: ['A Spirit biome with its own enemies', 'Bosses such as Scarabeus and Atlas', 'Frost Legion event and music'],
    categories: ['content', 'bosses', 'exploration', 'weapons'],
    hue: 165,
    note: 'The original Spirit Mod is now published on the Workshop as "Spirit Classic". A separate rebuilt version, "Spirit Reforged", is also available.',
    extraLinks: [{ label: 'Spirit Reforged (Steam Workshop)', url: workshopItemUrl('3449158983') }],
  }),
  make({
    id: 'stars-above',
    slug: 'the-stars-above',
    name: 'The Stars Above',
    workshopId: '2563862309',
    description:
      'A boss-focused content mod with its own mystic damage type and subworld content, with changelogs kept on its Discord server.',
    features: ['Its own "mystic" damage type', 'New bosses and items', 'Subworld content'],
    categories: ['content', 'bosses', 'weapons'],
    hue: 225,
  }),
  make({
    id: 'infernum',
    slug: 'infernum-mode',
    name: 'Infernum Mode',
    workshopId: '3459129920',
    description:
      'A difficulty mode built on top of Calamity Mod that changes boss and enemy behavior for a much tougher challenge.',
    features: ['Requires Calamity Mod', 'Reworked boss and enemy AI', 'Listed on the Workshop as "Calamity Mod Infernum Mode"'],
    categories: ['difficulty', 'bosses'],
    hue: 15,
    note: 'Infernum Mode needs Calamity Mod to be enabled.',
    requires: ['Calamity Mod'],
  }),
  make({
    id: 'magic-storage',
    slug: 'magic-storage',
    name: 'Magic Storage',
    workshopId: '2563309347',
    description:
      'A unified storage system: search and filter all your items, craft directly from storage, and use multiple access points across the world.',
    features: [
      'Search storage by name and filter by item type',
      'Craft items straight from your storage',
      'Scales with your progression — usable early, stronger later',
    ],
    categories: ['qol', 'utility'],
    hue: 260,
    editorsChoice: true,
  }),
  make({
    id: 'recipe-browser',
    slug: 'recipe-browser',
    name: 'Recipe Browser',
    workshopId: '2619954303',
    description: 'Look up any crafting recipe in game, including recipes added by other mods.',
    features: ['In-game recipe lookup', 'Covers vanilla and modded recipes'],
    categories: ['qol', 'utility'],
    hue: 130,
  }),
  make({
    id: 'boss-checklist',
    slug: 'boss-checklist',
    name: 'Boss Checklist',
    workshopId: '2669644269',
    description:
      'An in-game progression checklist (the "Boss Log") that tracks bosses and events across vanilla and supporting mods.',
    features: ['Boss Log UI inside the game', 'Tracks vanilla and modded bosses and events', 'Other mods can add support for it'],
    categories: ['qol', 'utility', 'bosses'],
    hue: 55,
    editorsChoice: true,
  }),
]

export const getModBySlug = (slug: string) => mods.find((m) => m.slug === slug)
