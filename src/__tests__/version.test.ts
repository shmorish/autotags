import { parseVersion, bumpVersion, formatVersion } from '../version'

describe('parseVersion', () => {
  it('vプレフィックス付きのsemverをパースする', () => {
    expect(parseVersion('v1.2.3')).toEqual({ major: 1, minor: 2, patch: 3 })
  })

  it('プレフィックスなしのsemverをパースする', () => {
    expect(parseVersion('1.2.3')).toEqual({ major: 1, minor: 2, patch: 3 })
  })

  it('初回デフォルト値 v0.0.0 をパースする', () => {
    expect(parseVersion('v0.0.0')).toEqual({ major: 0, minor: 0, patch: 0 })
  })

  it('無効なバージョン文字列でエラーを投げる', () => {
    expect(() => parseVersion('invalid')).toThrow('Invalid semver tag: invalid')
  })

  it('部分的なsemverでエラーを投げる', () => {
    expect(() => parseVersion('v1.2')).toThrow('Invalid semver tag: v1.2')
  })
})

describe('bumpVersion', () => {
  const base = { major: 1, minor: 2, patch: 3 }

  it('patchをインクリメントする', () => {
    expect(bumpVersion(base, 'patch')).toEqual({ major: 1, minor: 2, patch: 4 })
  })

  it('minorをインクリメントしpatchをリセットする', () => {
    expect(bumpVersion(base, 'minor')).toEqual({ major: 1, minor: 3, patch: 0 })
  })

  it('majorをインクリメントしminor/patchをリセットする', () => {
    expect(bumpVersion(base, 'major')).toEqual({ major: 2, minor: 0, patch: 0 })
  })

  it('無効なbumpタイプでエラーを投げる', () => {
    expect(() => bumpVersion(base, 'invalid' as never)).toThrow(
      'Invalid bump type: invalid'
    )
  })

  it('v0.0.0からpatchをインクリメントする', () => {
    expect(bumpVersion({ major: 0, minor: 0, patch: 0 }, 'patch')).toEqual({
      major: 0,
      minor: 0,
      patch: 1
    })
  })
})

describe('formatVersion', () => {
  it('デフォルトプレフィックス v を付けてフォーマットする', () => {
    expect(formatVersion({ major: 1, minor: 2, patch: 3 })).toBe('v1.2.3')
  })

  it('カスタムプレフィックスでフォーマットする', () => {
    expect(formatVersion({ major: 1, minor: 2, patch: 3 }, 'release-')).toBe(
      'release-1.2.3'
    )
  })

  it('空のプレフィックスでフォーマットする', () => {
    expect(formatVersion({ major: 2, minor: 0, patch: 0 }, '')).toBe('2.0.0')
  })
})
