class GeminiAPI {
  static async sendMessage(message, history) {
    // システムプロンプトの設定
    const systemPrompt = `あなたは親切で賢いAIアシスタントです。
以下の指示に従って回答してください：

1. 常に日本語で応答してください。
2. 専門用語を使う場合は、必ず簡単な説明を添えてください。
3. 回答は簡潔かつ分かりやすく構造化してください。
4. マークダウン形式を使用して回答を整形してください。
5. 不適切な内容や有害な内容には応答しないでください。
6. 不確かな情報は提供せず、分からないことは正直に認めてください。

現在の会話履歴を考慮しながら、ユーザーの質問に丁寧に答えてください。`;

    // 会話履歴にシステムプロンプトを追加
    const fullMessage = `${systemPrompt}\n\nUser: ${message}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: fullMessage,
            },
          ],
        },
      ],
    };

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${CONFIG.API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content ||
        !data.candidates[0].content.parts ||
        !data.candidates[0].content.parts[0]
      ) {
        throw new Error("Invalid response structure");
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini API Error:", error);

      let userMessage = "エラーが発生しました。";
      if (error.message.includes("API Error: 429")) {
        userMessage =
          "APIの呼び出し回数が制限を超えました。しばらく待ってから再度お試しください。";
      } else if (error.message.includes("API Error: 401")) {
        userMessage = "APIキーが無効です。正しいAPIキーを設定してください。";
      } else if (error.message.includes("API Error: 400")) {
        userMessage = "リクエストが不正です。入力内容を確認してください。";
      } else if (error.message.includes("Failed to fetch")) {
        userMessage =
          "APIとの通信に失敗しました。インターネット接続を確認してください。";
      } else if (error.message === "Invalid response structure") {
        userMessage = "APIからの応答形式が不正でした。もう一度お試しください。";
      }

      return userMessage;
    }
  }

  // 会話履歴を考慮したメッセージの構築
  static buildConversationContext(history, currentMessage) {
    const messages = history.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');

    return `${messages}\n\nUser: ${currentMessage}`;
  }
}
