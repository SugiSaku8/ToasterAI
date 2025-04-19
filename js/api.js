class GeminiAPI {
  static async sendMessage(message, history) {
    const requestBody = {
      contents: [{
        parts: [{
          text: message
        }]
      }],
      generationConfig: CONFIG.GENERATION_CONFIG
    };

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' + CONFIG.API_KEY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from API');
      }

      const data = JSON.parse(text);

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
        throw new Error('Invalid response structure');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      let userMessage = 'エラーが発生しました。';
      if (error.message.includes('API Error: 429')) {
        userMessage = 'APIの呼び出し回数が制限を超えました。しばらく待ってから再度お試しください。';
      } else if (error.message.includes('API Error: 401')) {
        userMessage = 'APIキーが無効です。正しいAPIキーを設定してください。';
      } else if (error.message.includes('API Error: 400')) {
        userMessage = 'リクエストが不正です。入力内容を確認してください。';
      } else if (error.message.includes('API Error: 405')) {
        userMessage = 'APIの呼び出し方法が正しくありません。開発者に連絡してください。';
      } else if (error.message === 'Empty response from API') {
        userMessage = 'APIからの応答が空でした。もう一度お試しください。';
      } else if (error.message === 'Invalid response structure') {
        userMessage = 'APIからの応答形式が不正でした。もう一度お試しください。';
      }

      return userMessage;
    }
  }
}
