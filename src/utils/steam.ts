// tModLoader's Steam App ID (Steam Workshop for tModLoader).
export const TMODLOADER_APP_ID = 1281930

/** Direct link to a Workshop item by its numeric ID. */
export const workshopItemUrl = (id: string) => `https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`

/** Official Steam Workshop search URL for a mod name. */
export const workshopSearchUrl = (query: string) =>
  `https://steamcommunity.com/workshop/browse/?appid=${TMODLOADER_APP_ID}&searchtext=${encodeURIComponent(
    query,
  )}&browsesort=textsearch`
