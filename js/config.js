/**
 * アプリ全体で使用する設定値をまとめた定数オブジェクト
 * - APIキーやエンドポイント
 * - 生成パラメータ
 * - セーフティ設定
 */
const CONFIG = {
  /**
   * Gemini APIのAPIキー
   * @type {string}
   */
  API_KEY: "AIzaSyDo7xQq1dIHy1j4xNCmZh2vyzX3rE74PF0",

  /**
   * Gemini APIのエンドポイントURL
   * @type {string}
   */
  API_URL:
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',

  /**
   * テキスト生成時のパラメータ設定
   * @type {{temperature: number, topK: number, topP: number, maxOutputTokens: number}}
   */
  GENERATION_CONFIG: {
    /** 生成の多様性（0.0〜1.0） */
    temperature: 0.1,
    /** 上位K個のトークンからサンプリング */
    topK: 40,
    /** トークン確率の合計がtopP以下になるまでサンプリング */
    topP: 0.95,
    /** 出力トークンの最大数 */
    maxOutputTokens: 4086,
  },

  /**
   * セーフティカテゴリごとのフィルタ設定
   * @type {Array<{category: string, threshold: string}>}
   */
  SAFETY_SETTINGS: [
    {
      /** ハラスメントカテゴリの閾値 */
      category: "HARASSMENT",
      threshold: "BLOCK_ALL",
    },
    {
      /** ヘイトスピーチカテゴリの閾値 */
      category: "HATE_SPEECH",
      threshold: "BLOCK_ALL",
    },
    {
      /** 性的表現カテゴリの閾値 */
      category: "SEXUALLY_EXPLICIT",
      threshold: "BLOCK_ALL",
    },
    {
      /** 危険な内容カテゴリの閾値 */
      category: "DANGEROUS_CONTENT",
      threshold: "BLOCK_ALL",
    },
  ],
};