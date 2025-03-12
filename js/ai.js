import   {GoogleGenerativeAI} from  "./g_gen.js"; 
import wi from "./wi.js";
const API = new GoogleGenerativeAI("AIzaSyDo7xQq1dIHy1j4xNCmZh2vyzX3rE74PF0");

const ai = API.getGenerativeModel({ model: "gemini-2.0-flash"});
async function AI(payload) {
  console.log(payload);
  try {
    const response = await ai.generateContent(payload); // ライブラリを使用してコンテンツを生成
    return response; // 返り値を適切に設定
  } catch (error) {
    console.log(error);
  }
}

async function GenPayload(type, data, a, b) {
  if (type === "GenTitle") {
    return {
      contents: [
        {
          parts: [
            {
              text: `${data}と言う内容で、Wikipediaで検索をしたいのですが、適切な検索ワードが思いつきません。\n適切なWikipedia記事の名前を選んで、名前だけを返してください。\nそれ以外は返さないでください。`,
            },
          ],
        },
      ],
    };
  }
  if (type === "GenKiji") {
    return {
      contents: [
        {
          parts: [
            {
              text: `${data}の内容のレポートを作成してください。\n長ったらしくならないようにしてください。`,
            },
          ],
        },
      ],
    };
  }
  if (type === "hyouka") {
    return {
      contents: [
        {
          parts: [
            {
              text: `${a}の回答として、${data}のレポートは、${b}のデータからして適切なものですか？\n適切なら、_Good!_を文章中に、適切でないなら_Bad_を文章中に埋め込む形で回答してください。`,
            },
          ],
        },
      ],
    };
  }
}

async function ReSearch(title) {
  const SearchTitle = [];
  SearchTitle[0] = title;

  let isGood = false;
  let finalResult = null;

  while (!isGood) {
    SearchTitle[1] = await GenPayload("GenTitle", SearchTitle[0], 0, 0);
    const rewrittenTitle = await AI(SearchTitle[1]);
    if (!rewrittenTitle) {
      console.error("Deep-in-Search:AIによるタイトル生成に失敗しました。");
      break; 
    }
    const searchResults = await wi(rewrittenTitle);
    if (!searchResults) {
      console.error("Deep-in-Search:検索結果の取得に失敗しました。");
      break;
    }
    const kiji_pay = await GenPayload("GenKiji", searchResults, 0, 0);
    const kiji = await AI(kiji_pay);
    if (searchResults.length > 0) {
      const hyouka_ = await GenPayload(
        "hyouka",
        SearchTitle[1],
        searchResults,
        kiji
      );
      if (hyouka_.indexOf("_Good!_") !== -1) { // 修正: indexOfの結果を確認
        finalResult = kiji;
      }
    } else {
      SearchTitle[0] = rewrittenTitle;
    }
  }

  return finalResult;
}

const _dtd_ = await ReSearch("二次方程式");
console.log(_dtd_);