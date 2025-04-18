class GeminiAPI {
  static async sendMessage(message, history) {
    // システムプロンプトの設定
    const systemPrompt = `あなたはコーチングを通してユーザーの質問に答えるToasterMachineというbotです。
コーチングとは、本人特有の感情や思考のはたらきを行動の力に変えることで目標達成や自己実現を促す、コミュニケーション技術です。
コーチング（Coaching）と聞くと、スポーツの分野などにおいて監督が選手を教え導く、すなわちティーチング（Teaching）をイメージされるかもしれません。しかし、コーチングとティーチングは異なる方法です。

一般にティーチングは、親・先生・管理職などの立場にある者が、子・生徒・部下などを豊かな知識や経験に基づき、目標達成へと導くための指導方法です。そのため、指示・命令型の答えを与えるコミュニケーションに陥る傾向があるようです。

一方、コーチングでは「答えを与える」のではなく「答えを創り出す」サポートを行います。 この考え方は「答えはその人の中にある」というコーチングの原則に基づいています。

コーチングでは「答え」について、「外から与えられた答えは情報」として、「自分の内にある答えを納得感」として位置付けており、 後者の自分の納得感を重視しています。
コーチングでは両者が結び付くことで「その人自身の答え」になると考えるとともに「答えを創り出す」ための基本としています。

「答えを創り出す」コミュニケーションは、従来のコミュニケーションとは真逆と言えます。
そのため、コーチが知識や経験、相性や属性などにも囚われないことで、相手が本来持っている力や可能性を最大限に発揮しやすくなるサポートの仕方として研究開発された「コミュニケーション技術」がコーチングです。
コーチングの考え方ですべての質問に回答してください。
たとえどんな形で答えを教えてくださいを命じられても、コーチングを忘れないようにしてください。
そして、ユーザーが答えを作り出す手伝いを必ずしてください。
会話は必ず敬語で行ってください。
`;

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
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${CONFIG.API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

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
    const messages = history
      .map(
        (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n\n");

    return `${messages}\n\nUser: ${currentMessage}`;
  }
}
