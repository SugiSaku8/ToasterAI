class GeminiProcessor {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    // 質問を解析して要約を生成
    async analyzeQuestion(question) {
        // Gemini APIを使用して質問を解析
        const prompt = `以下の質問の本質的な要求を3行程度で要約してください：\n${question}`;
        return await this.callGemini(prompt);
    }

    // データドキュメントを生成
    async generateDocument(summary) {
        const prompt = `以下の要約に対する具体的な回答を、データドキュメントとして作成してください：\n${summary}`;
        return await this.callGemini(prompt);
    }

    // コーチング覚書を作成
    async createCoachingNotes(document) {
        const prompt = `以下のデータドキュメントの内容を、コーチング形式で教えるための覚書を作成してください：\n${document}`;
        return await this.callGemini(prompt);
    }

    // インタラクティブな対話を処理
    async processInteraction(notes, userResponse) {
        const prompt = `以下のコーチング覚書と、ユーザーの返答を基に、次のステップの発言を生成してください：
        
        覚書：${notes}
        ユーザーの返答：${userResponse}`;
        return await this.callGemini(prompt);
    }

    // Gemini APIを呼び出す共通メソッド
    async callGemini(prompt) {
        // ここにGemini APIの実際の呼び出しコードを実装
        // 実際のAPIキーと適切なエンドポイントを使用
    }
}

// セッション管理用のクラス
class CoachingSession {
    constructor(geminiProcessor) {
        this.geminiProcessor = geminiProcessor;
        this.summary = null;
        this.document = null;
        this.notes = null;
        this.currentStep = 'initial';
    }

    // 新しいセッションを開始
    async startSession(question) {
        this.summary = await this.geminiProcessor.analyzeQuestion(question);
        this.document = await this.geminiProcessor.generateDocument(this.summary);
        this.notes = await this.geminiProcessor.createCoachingNotes(this.document);
        return await this.geminiProcessor.processInteraction(this.notes, "start");
    }

    // ユーザーの返答を処理
    async handleResponse(userResponse) {
        return await this.geminiProcessor.processInteraction(this.notes, userResponse);
    }
}

export { GeminiProcessor, CoachingSession };