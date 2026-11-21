export type Quality = 'low' | 'high'

/** True when the browser can create a WebGL context. */
export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Cheap heuristic: phones and weak devices get a lighter 3D scene. */
export function getQuality(): Quality {
  const nav = navigator as Navigator & { deviceMemory?: number }
  const smallScreen = window.innerWidth < 768
  const touchOnly = window.matchMedia('(pointer: coarse)').matches
  const fewCores = (nav.hardwareConcurrency ?? 8) <= 4
  const lowMemory = (nav.deviceMemory ?? 8) <= 4
  return smallScreen || touchOnly || fewCores || lowMemory ? 'low' : 'high'
}
