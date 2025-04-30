/**
 * Wikipedia日本語版から指定クエリのページ本文テキストを取得する非同期関数
 * - HTMLタグやリンク、span、style要素を除去し、純粋なテキストのみを返す
 * 
 * @param {string} query Wikipediaで検索するページ名
 * @returns {Promise<string>} ページ本文のテキスト（整形済み）
 */
export default async function wi(query) {
    // Wikipedia APIからページデータを取得
    const response = await fetch(`https://ja.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(query)}&format=json&origin=*`);
    const data = await response.json();

    // ページ本文のHTMLを取得
    const htmlContent = data.parse.text['*'];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // aタグとspanタグをすべて除去
    const linksAndSpans = doc.querySelectorAll('a, span');
    linksAndSpans.forEach(element => element.remove());

    // styleタグをすべて除去
    const styles = doc.querySelectorAll('style');
    styles.forEach(style => style.remove());

    // テキストのみを抽出し、改行や不要な/nを除去
    let textContent = doc.body.textContent;
    textContent = textContent.replace(/\/n/g, '').replace(/\n/g, '');
    return textContent;
}