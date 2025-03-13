export default async function wi(query) {
    const response = await fetch(`https://ja.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(query)}&format=json&origin=*`);
    const data = await response.json();
    const htmlContent = data.parse.text['*'];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const linksAndSpans = doc.querySelectorAll('a, span');
    linksAndSpans.forEach(element => element.remove());
    const styles = doc.querySelectorAll('style');
    styles.forEach(style => style.remove());
    let textContent = doc.body.textContent;
    textContent = textContent.replace(/\/n/g, '').replace(/\n/g, '');
    return textContent;
}