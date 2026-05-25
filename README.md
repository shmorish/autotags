# Auto Tags

PRがmainにマージされたとき、自動的にsemverタグを作成するGitHub Actionです。

## 使い方

```yaml
name: Auto Tag on Merge

on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  tag:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: shmorish/autotags@v1
        with:
          bump: patch   # patch / minor / major
```

## Inputs

| 名前 | 必須 | デフォルト | 説明 |
|------|:----:|-----------|------|
| `bump` | ✓ | `patch` | バージョンの上げ幅: `patch` / `minor` / `major` |
| `token` | — | `${{ github.token }}` | タグ作成に使うGitHub Token |
| `tag-prefix` | — | `v` | タグのプレフィックス（例: `v` → `v1.2.3`） |

## Outputs

| 名前 | 説明 |
|------|------|
| `new-tag` | 新しく作成したタグ（例: `v1.2.4`） |
| `previous-tag` | バンプ前のタグ（例: `v1.2.3`） |

## 動作例

| 現在のタグ | bump | 新しいタグ |
|-----------|------|-----------|
| `v1.2.3` | `patch` | `v1.2.4` |
| `v1.2.3` | `minor` | `v1.3.0` |
| `v1.2.3` | `major` | `v2.0.0` |
| *(タグなし)* | `patch` | `v0.0.1` |

## outputs を使う例

```yaml
- uses: shmorish/autotags@v1
  id: tag
  with:
    bump: minor

- run: echo "Created ${{ steps.tag.outputs.new-tag }}"
```

## PRラベルでbumpを自動決定する例

```yaml
- uses: shmorish/autotags@v1
  with:
    bump: >-
      ${{
        contains(github.event.pull_request.labels.*.name, 'major') && 'major' ||
        contains(github.event.pull_request.labels.*.name, 'minor') && 'minor' ||
        'patch'
      }}
```

## ライセンス

MIT
