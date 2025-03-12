export default async function searchDuckDuckGo(query) {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(
      query
    )}&format=json&pretty=1&region=jp`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      dialog(
        "拡張情報取得機能",
        "情報の取得に失敗しました。\nメッセージ:" + error
      );
      return null;
    }
  }
  