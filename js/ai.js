// CDNを使用する場合の例
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
const API = new GoogleGenerativeAI("AIzaSyDy-hvsukvEeCUNRWQKfq9ty2VBQtk1pKY");

const ai = API.getGenerativeModel({ model: "gemini-2.0-flash" });
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
              text: `${data}と言う内容で、検索をしたいのですが、適切な検索ワードが思いつきません。\n適切なワードを選んで、名前だけを返してください。\nそれ以外は返さないでください。`,
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
              text: `${data}の回答として正確なレポートを作成してください。\n長ったらしくならないようにしてください。`,
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
              text: `${a}の回答として、${data}のレポートは、適切なものですか？\n適切なら、_Good!_を文章中に、適切でないなら_Bad_を文章中に埋め込む形で回答してください。\n評価は、必ずWeb上の情報をもとにお願いします。`,
            },
          ],
        },
      ],
    };
  }
}

export default async function ReSearch() {
  var input = document.getElementById("user-input");
  var title = input.value;
  const SearchTitle = [];
  SearchTitle[0] = title;
  let isGood = false;
  let finalResult = null;
  var text = input.value;
  input.value = "";
  var message = document.createElement("div");
  message.textContent = text;
  message.className = "message user";
  document.getElementById("chat-container").appendChild(message);
  while (!isGood) {
    const kiji_pay = await GenPayload("GenKiji", title, title, title);
    const kiji = await AI(kiji_pay);
    const hyouka_pay_ = await GenPayload(
      "hyouka",
      kiji.response.candidates[0].content.parts[0].text,
      title,
      kiji.response.candidates[0].content.parts[0].text
    );
    const hyouka_ = await AI(hyouka_pay_);
    if (
      hyouka_.response.candidates[0].content.parts[0].text.indexOf(
        "_Good!_"
      ) === false
    ) {
      let finalResults = kiji.response.candidates[0].content.parts[0].text;
      var botMessage = document.createElement("div");
      botMessage.className = "message bot";
      botMessage.textContent = finalResults;
      document.getElementById("chat-container").appendChild(botMessage);
    } else {
      isGood = true;
    }
  }

  return;
}

async function run() {
  var input = document.getElementById("user-input");
  var text = input.value;
  input.value = "";
  var message = document.createElement("div");
  message.textContent = text;
  message.className = "message user";
  document.getElementById("chat-container").appendChild(message);
  var botMessage = document.createElement("div");
  let res = await AI(text);
  console.log(res);
  let restx = res.response.candidates[0].content.parts[0].text;
  botMessage.textContent = restx;
  botMessage.className = "message bot";

  document.getElementById("chat-container").appendChild(botMessage);
}

document.getElementById("clocki").onclick = ReSearch;
