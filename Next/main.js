import { AICoachingAPI } from "./api.js";
import { UIController } from "./ui.js";

class AICoachingApp {
  constructor() {
    this.api = new AICoachingAPI("YOUR_GEMINI_API_KEY");
    this.ui = new UIController();
    this.sessionId = null;
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.ui.setOnSendCallback(async (message) => {
      try {
        this.ui.disableInput();

        if (!this.sessionId) {
          // 新しいセッションを開始
          const response = await this.api.startNewSession("user1", message);
          this.sessionId = response.sessionId;
          this.ui.updateSummary(response.summary);
          this.ui.updateDocument(response.document);
          this.ui.addAIMessage(response.response);
        } else {
          // 既存のセッションに返答を送信
          const response = await this.api.processResponse(
            this.sessionId,
            message
          );
          this.ui.addAIMessage(response.response);
        }

        this.ui.setStatus("準備完了", "ready");
      } catch (error) {
        console.error("エラーが発生しました:", error);
        this.ui.setStatus("エラーが発生しました", "error");
        this.ui.addAIMessage(
          "申し訳ありません。エラーが発生しました。もう一度お試しください。"
        );
      } finally {
        this.ui.enableInput();
      }
    });
  }
}

// アプリケーションの初期化
window.addEventListener("DOMContentLoaded", () => {
  new AICoachingApp();
});
