# ポモドーロタイマー 要件定義書

## 1. 概要

シンプルなポモドーロタイマーの Web アプリケーション。PWA 対応でオフライン環境でも利用可能。完了セッションの履歴を蓄積し、週間グラフ・月間ヒートマップで可視化する。

## 2. 技術スタック

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (Radix UI ベース)
- テーマ切替: `next-themes` (`class` strategy で `<html>` に `light`/`dark` 付与)
- 永続化: localStorage
- PWA: Service Worker (`next-pwa` または `@serwist/next`)
- 言語: 日本語固定 (UI コピーは日本語、`<html lang="ja">`)

## 3. 機能要件

### 3.1 タイマー機能

- 作業 / 休憩 の 2 フェーズ構成(長休憩なし)
- 操作: 開始 / 一時停止 / 再開 / リセット
- 残り時間をカウントダウン表示(分:秒)
- 経過時間の計測は **終了予定時刻保持方式** を採用
  - `setInterval` の精度に依存せず、`Date.now()` との差分で残り時間を算出
  - バックグラウンドタブでもズレない

#### 状態機械

- 状態:
  - `idle` … 開始前(リセット直後を含む)
  - `running` … カウントダウン中
  - `paused` … 一時停止中(残り ms を保持)
- フェーズ: `work` / `break`
- 遷移:

```text
idle    --start-->     running
running --pause-->     paused
paused  --resume-->    running
running --reset-->     idle
paused  --reset-->     idle
running --フェーズ満了--> 通知発火 → 次フェーズへ
                          - 自動遷移 ON: 次フェーズ `running` (即継続)
                          - 自動遷移 OFF: 次フェーズ `idle` (ユーザー操作待ち)
```

#### リセット仕様

- 現フェーズの残り時間を、現在選択中プリセットの初期値に戻し `idle` へ遷移
- フェーズ種別(work / break)はリセット時点のまま保持(サイクル先頭への巻き戻しはしない)

#### 一時停止 / 再開仕様

- 一時停止: 一時停止時点の残り ms を保持、`Date.now()` ベースの算出を停止
- 再開: `endAt = Date.now() + 残り ms` で終了予定時刻を再計算して `running` へ復帰

### 3.2 プリセット

- 複数プリセットを名前付きで保存可能
- 追加 / 編集 / 削除に対応
- 初回起動時に「クラシック 25/5」を 1 件デフォルトで投入
- 保存先: localStorage

#### 走行中の切替・編集

- タイマーが `running` または `paused` の状態では、選択中プリセットの切替・編集・削除は不可 (UI 上 disabled)
- `idle` で初めて切替・編集・削除が可能
- 削除対象が現在選択中プリセットの場合、削除後は残存プリセットの先頭を自動選択
- 全プリセット削除は不可 (最低 1 件残す)

### 3.3 状態遷移

- 作業 → 休憩 → 作業 → … のループ
- 自動遷移 / 手動遷移を設定で切替可能
  - 自動: フェーズ終了で通知を出しつつ次のフェーズへ即移行
  - 手動: 通知を出して停止、ユーザーが「次へ」を押す

### 3.4 通知

#### ブラウザ通知
- 設定画面でトグル有効化
- 初回オン時に権限要求(いきなり要求しない)
- 権限拒否時はトグルがオフのまま戻る

#### 音声通知
- 1 種類固定(設定で選択不可)
- 1 回のみ再生
- 音量調整スライダー(0〜100)
- ミュートは音量 0 で代替(独立トグルなし)

#### 通知タイミング
- 作業セッション終了時
- 休憩セッション終了時

### 3.5 履歴・統計

#### 記録対象
- **完了した作業セッションのみ** 記録
- 中断・スキップしたセッションは記録しない

#### 記録項目
- 完了日時
- 使用したプリセット名(スナップショット)
- 作業時間(分)

#### 表示
- 過去 7 日間の棒グラフ(日別の完了ポモドーロ数)
- 月間ヒートマップ(GitHub の草風、日別の完了数を濃淡で表現)

### 3.6 設定画面

- shadcn/ui の `Dialog` で実装(モーダル)
- 設定項目
  - プリセット管理(追加 / 編集 / 削除)
  - ブラウザ通知の有効/無効
  - 音量
  - 自動遷移の有効/無効
  - テーマ(ライト / ダーク / システム連動)

#### 走行中の設定変更挙動

- `volume`: 即時反映(次回再生する音から新音量)
- `notificationEnabled`: 即時反映
- `autoTransition`: 即時反映(次回フェーズ満了時から新挙動)
- `theme`: 即時反映
- プリセット内容変更は 3.2 の制約に従う(`running`/`paused` 中は当該プリセット編集不可)

### 3.7 PWA

- ホーム画面追加対応(`manifest.json`, アイコン各サイズ)
- Service Worker によるアセットキャッシュ
- **オフライン対応の範囲**: タブが開いている前提で、ネット切断時もアプリ起動・タイマー動作・通知発火が可能
- タブを閉じた状態でのバックグラウンド通知は対象外(Web Push は使わない)

### 3.8 その他 UX

- ダークモード(Tailwind の `dark:` プレフィックス + shadcn/ui のテーマ機構 + `next-themes`)
- `<title>` に残り時間を表示(例: `25:00 - ポモドーロ`)
- モバイルレスポンシブ対応(PWA 前提)

#### 画面レイアウト

- ヘッダー右上にアイコンボタン群を横並び配置
  - 設定アイコン → 設定 Dialog を開く
  - 履歴アイコン → 履歴画面に遷移(フェーズ 6 で実装)
- メインエリア中央: プリセット選択 → フェーズラベル → 残り時間 → 操作ボタン群

#### アクセシビリティ

- Dialog のフォーカストラップは Radix UI の標準実装に依拠
- 残り時間表示は `role="timer"` + `aria-label` でフェーズと残り時間を提示。秒単位の `aria-live` 更新は読み上げ過剰のため避け、フェーズ切替時のラベル更新でのみ通知
- 操作ボタンは状態 (`idle`/`running`/`paused`) に応じて表示切替するが、`disabled` 属性は通常状態の見た目を維持し、無効ケースは可視性を損なわない

## 4. 非機能要件

- ローカル完結(サーバー不要、認証なし)
- 全データは localStorage に保存
- ネットワーク接続不要で全機能が動作

## 5. スコープ外(今回はやらない)

- 長休憩(ロングブレイク)
- 複数デバイス間の同期
- アカウント / 認証機能
- タブを閉じた状態でのバックグラウンド通知(Web Push)
- セッションへのタスク名・メモの紐付け
- 中断セッションの記録
- タブを閉じた後の続きからの再開(リロード時はリセット)
- 音声の種類選択
- キーボードショートカット

## 6. データ構造

```typescript
// プリセット
type Preset = {
  id: string;
  name: string;
  workMinutes: number;
  breakMinutes: number;
  createdAt: number;
};

// 履歴(完了セッションのみ)
type Session = {
  id: string;
  presetId: string;
  presetName: string; // プリセット削除後も履歴表示できるようスナップショット保持
  workMinutes: number;
  completedAt: number; // UNIX ms
};

// 設定
type Settings = {
  notificationEnabled: boolean;
  volume: number; // 0-100
  autoTransition: boolean;
};

// テーマは next-themes が独立して localStorage に保存(キーは `pomodoro:theme`)
type ThemeMode = 'light' | 'dark' | 'system';
```

### localStorage キー

| キー | 値 |
|------|-----|
| `pomodoro:presets` | `Stored<Preset[]>` |
| `pomodoro:sessions` | `Stored<Session[]>` |
| `pomodoro:settings` | `Stored<Settings>` |
| `pomodoro:selectedPresetId` | `Stored<string>` |
| `pomodoro:theme` | `ThemeMode` (next-themes が直接管理。`Stored<T>` ラッパーなし) |

### スキーマ管理

各 localStorage 値はラッパー型 `Stored<T>` で保持し `schemaVersion` を付ける。

```typescript
type Stored<T> = {
  schemaVersion: number;
  data: T;
};
```

- 現行 `schemaVersion` は 1
- 将来の breaking change 時はバージョンを上げてマイグレーション関数で旧形式を変換
- バージョンが想定外(未来 or 不明値)の場合は当該キーを破棄してデフォルト復元

### 容量・破損対応

- `pomodoro:sessions` は **直近 365 日分** を保持上限。超過分は `completedAt` の古い順に破棄
- `JSON.parse` 失敗 / スキーマ検証失敗時は当該キーを破棄してデフォルト値で復元(意味のあるエラーは silently swallow せず、開発時は `console.warn` で記録)
- 書き込み時 `QuotaExceededError` をキャッチした場合、`sessions` を最古から段階的に削減して再試行

## 7. 主要な設計判断のメモ

- **タイマー精度**: `setInterval` の 1 秒減算ではなく、終了予定時刻を保持して `Date.now()` 差分で算出。バックグラウンドタブのスロットリング対策。
- **状態の永続化はしない**: 走行中のタイマー状態を localStorage に書き込まない。タブを閉じたら素直にリセット。
- **通知権限の要求タイミング**: ユーザーが設定画面で明示的にオンにしたときのみ。初回タイマー開始時にいきなり要求しない。
- **音声と通知は独立**: ブラウザ通知が無効でも音声は鳴る。逆も同様。
- **プリセット名スナップショット**: 履歴にプリセット ID だけを持つと、プリセット削除時に履歴の表示が崩れる。名前を一緒に保存。

## 8. 想定する実装フェーズ

1. プロジェクトセットアップ(Next.js + Tailwind + shadcn/ui)
2. 基本タイマー機能(作業/休憩、開始/停止/リセット)
3. プリセット管理(CRUD + localStorage)
4. 設定 Dialog
5. 通知機能(ブラウザ通知 + 音声)
6. 履歴記録 + 週間グラフ + 月間ヒートマップ
7. ダークモード / ページタイトル
8. PWA 化(manifest, Service Worker, アイコン)
9. オフライン動作確認
