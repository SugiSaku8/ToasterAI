import { GeminiProcessor, CoachingSession } from "./model.js";

class AICoachingAPI {
  constructor(apiKey) {
    this.geminiProcessor = new GeminiProcessor(apiKey);
    this.sessions = new Map();
  }

  // 新しいコーチングセッションを開始
  async startNewSession(userId, question) {
    const session = new CoachingSession(this.geminiProcessor);
    const initialResponse = await session.startSession(question);
    this.sessions.set(userId, session);
    return {
      sessionId: userId,
      response: initialResponse,
    };
  }

  // セッションに対する応答を処理
  async processResponse(userId, userResponse) {
    const session = this.sessions.get(userId);
    if (!session) {
      throw new Error("セッションが見つかりません");
    }
    const response = await session.handleResponse(userResponse);
    return {
      sessionId: userId,
      response: response,
    };
  }

  // セッションを終了
  endSession(userId) {
    this.sessions.delete(userId);
    return {
      sessionId: userId,
      status: "completed",
    };
  }
}

export { AICoachingAPI };
