import { getLatestTag, DEFAULT_INITIAL_TAG } from '../git'

const mockOctokit = {
  rest: {
    repos: {
      listTags: jest.fn()
    }
  }
}

describe('DEFAULT_INITIAL_TAG', () => {
  it('初回デフォルトタグは v0.0.0', () => {
    expect(DEFAULT_INITIAL_TAG).toBe('v0.0.0')
  })
})

describe('getLatestTag', () => {
  const owner = 'testowner'
  const repo = 'testrepo'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('semverタグが存在する場合に最新タグを返す', async () => {
    mockOctokit.rest.repos.listTags.mockResolvedValue({
      data: [
        { name: 'v1.2.3' },
        { name: 'v1.2.2' },
        { name: 'v1.1.0' }
      ]
    })

    const result = await getLatestTag(mockOctokit as never, owner, repo, 'v')
    expect(result).toBe('v1.2.3')
  })

  it('タグが存在しない場合に v0.0.0 を返す', async () => {
    mockOctokit.rest.repos.listTags.mockResolvedValue({ data: [] })

    const result = await getLatestTag(mockOctokit as never, owner, repo, 'v')
    expect(result).toBe('v0.0.0')
  })

  it('semver以外のタグを無視して最新のsemverタグを返す', async () => {
    mockOctokit.rest.repos.listTags.mockResolvedValue({
      data: [
        { name: 'latest' },
        { name: 'v2.0.0' },
        { name: 'beta' },
        { name: 'v1.9.9' }
      ]
    })

    const result = await getLatestTag(mockOctokit as never, owner, repo, 'v')
    expect(result).toBe('v2.0.0')
  })

  it('バージョン数値で正しくソートする（辞書順でなく数値順）', async () => {
    mockOctokit.rest.repos.listTags.mockResolvedValue({
      data: [
        { name: 'v1.9.0' },
        { name: 'v1.10.0' },
        { name: 'v1.2.0' }
      ]
    })

    const result = await getLatestTag(mockOctokit as never, owner, repo, 'v')
    expect(result).toBe('v1.10.0')
  })

  it('カスタムプレフィックスのタグを正しく処理する', async () => {
    mockOctokit.rest.repos.listTags.mockResolvedValue({
      data: [
        { name: 'release-1.0.0' },
        { name: 'release-2.0.0' }
      ]
    })

    const result = await getLatestTag(mockOctokit as never, owner, repo, 'release-')
    expect(result).toBe('release-2.0.0')
  })
})
