import { GitHub } from '@actions/github/lib/utils'
import { parseVersion, formatVersion, SemVer } from './version'

type Octokit = InstanceType<typeof GitHub>

export const DEFAULT_INITIAL_TAG = 'v0.0.0'

function isSemverTag(name: string, prefix: string): boolean {
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`^${escaped}\\d+\\.\\d+\\.\\d+$`).test(name)
}

function compareSemVer(a: SemVer, b: SemVer): number {
  if (a.major !== b.major) return a.major - b.major
  if (a.minor !== b.minor) return a.minor - b.minor
  return a.patch - b.patch
}

export async function getLatestTag(
  octokit: Octokit,
  owner: string,
  repo: string,
  prefix: string
): Promise<string> {
  const { data: tags } = await octokit.rest.repos.listTags({ owner, repo, per_page: 100 })

  const semverTags = tags
    .filter(tag => isSemverTag(tag.name, prefix))
    .map(tag => ({ name: tag.name, version: parseVersion(tag.name) }))
    .sort((a, b) => compareSemVer(b.version, a.version))

  if (semverTags.length === 0) {
    return DEFAULT_INITIAL_TAG
  }

  return semverTags[0].name
}

export async function createTag(
  octokit: Octokit,
  owner: string,
  repo: string,
  tag: string,
  sha: string
): Promise<void> {
  await octokit.rest.git.createRef({
    owner,
    repo,
    ref: `refs/tags/${tag}`,
    sha
  })
}
