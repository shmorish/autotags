import * as core from '@actions/core'
import * as github from '@actions/github'
import { BumpType, bumpVersion, formatVersion, parseVersion } from './version'
import { createTag, getLatestTag } from './git'

async function run(): Promise<void> {
  try {
    const context = github.context

    if (context.eventName === 'pull_request') {
      const pr = context.payload.pull_request
      if (!pr?.merged) {
        core.info('PRがマージされていないためスキップします')
        return
      }
    }

    const bump = core.getInput('bump', { required: true }) as BumpType
    const token = core.getInput('token', { required: true })
    const prefix = core.getInput('tag-prefix') || 'v'

    if (!['patch', 'minor', 'major'].includes(bump)) {
      throw new Error(`Invalid bump value: ${bump}. Must be patch, minor, or major.`)
    }

    const octokit = github.getOctokit(token)
    const { owner, repo } = context.repo
    const sha = context.sha

    const latestTag = await getLatestTag(octokit, owner, repo, prefix)
    core.info(`現在の最新タグ: ${latestTag}`)

    const currentVersion = parseVersion(latestTag)
    const nextVersion = bumpVersion(currentVersion, bump)
    const newTag = formatVersion(nextVersion, prefix)

    core.info(`新しいタグを作成します: ${newTag}`)
    await createTag(octokit, owner, repo, newTag, sha)

    core.setOutput('new-tag', newTag)
    core.setOutput('previous-tag', latestTag)
    core.info(`タグ ${newTag} を作成しました`)
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : String(error))
  }
}

run()
