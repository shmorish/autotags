export type BumpType = 'patch' | 'minor' | 'major'

export interface SemVer {
  major: number
  minor: number
  patch: number
}

export function parseVersion(tag: string): SemVer {
  const cleaned = tag.replace(/^[^0-9]*/, '')
  const match = cleaned.match(/^(\d+)\.(\d+)\.(\d+)$/)
  if (!match) {
    throw new Error(`Invalid semver tag: ${tag}`)
  }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10)
  }
}

export function bumpVersion(version: SemVer, bump: BumpType): SemVer {
  switch (bump) {
    case 'patch':
      return { ...version, patch: version.patch + 1 }
    case 'minor':
      return { ...version, minor: version.minor + 1, patch: 0 }
    case 'major':
      return { major: version.major + 1, minor: 0, patch: 0 }
    default:
      throw new Error(`Invalid bump type: ${bump}`)
  }
}

export function formatVersion(version: SemVer, prefix = 'v'): string {
  return `${prefix}${version.major}.${version.minor}.${version.patch}`
}
