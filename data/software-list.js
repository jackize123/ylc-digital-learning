// 縣購軟體與數位學習平台清單
// ⚠ 「縣購」項目請依數辦當年度正式公告增刪（confirmed 改 true 即移除「待確認」標示）
// 欄位：cat 分類 / name 名稱 / desc 一句話介紹 / login 登入方式 / url 平台網址 /
//       tutorial 使用教學連結 / confirmed 是否為已確認之縣購清單項目
window.DLO = window.DLO || {};
DLO.software = [
  { cat: "縣購軟體", name: "Padlet", desc: "數位便利貼牆，蒐集學生作品、共作討論與展示。", login: "縣配帳號（洽數辦）", url: "https://padlet.com/", tutorial: "https://padlet.help/", confirmed: false },
  { cat: "縣購軟體", name: "Canva 教育版", desc: "簡報、海報、影音設計工具，師生皆可用範本快速產出。", login: "教育帳號申請", url: "https://www.canva.com/education/", tutorial: "https://www.canva.com/designschool/", confirmed: false },
  { cat: "縣購軟體", name: "LoiLoNote School", desc: "卡片式教學互動平台，發送任務、即時回收與比較學生作答。", login: "學校代碼＋帳號", url: "https://loilonote.app/", tutorial: "https://help.loilonote.app/", confirmed: false },
  { cat: "教育部資源", name: "因材網", desc: "教育部適性學習平台：知識結構診斷、AI 學習夥伴、四學工具。", login: "教育雲端帳號", url: "https://adl.edu.tw/", tutorial: "https://adl.edu.tw/", confirmed: true },
  { cat: "教育部資源", name: "教育雲", desc: "教育部數位學習入口，單一帳號串接各大平台。", login: "教育雲端帳號", url: "https://cloud.edu.tw/", tutorial: "https://cloud.edu.tw/", confirmed: true },
  { cat: "教育部資源", name: "校園數位內容與教學軟體", desc: "教育部軟體採購平台，縣購軟體多由此選購，可查各產品介紹。", login: "無需登入即可瀏覽", url: "https://www.sdc.org.tw/", tutorial: "https://www.sdc.org.tw/", confirmed: true },
  { cat: "常用免費平台", name: "PaGamO", desc: "遊戲化題庫平台，以攻城掠地方式作答練習。", login: "教育雲端帳號", url: "https://www.pagamo.org/", tutorial: "https://www.pagamo.org/", confirmed: true },
  { cat: "常用免費平台", name: "均一教育平台", desc: "影片＋練習題的自學平台，適合差異化補救教學。", login: "教育雲端帳號", url: "https://www.junyiacademy.org/", tutorial: "https://support.junyiacademy.org/", confirmed: true },
  { cat: "常用免費平台", name: "學習吧 LearnMode", desc: "課程包與 AI 語音批改（朗讀、背誦），國語文應用廣。", login: "教育雲端帳號", url: "https://www.learnmode.net/", tutorial: "https://www.learnmode.net/", confirmed: true }
];
DLO.softwareCats = ["縣購軟體", "教育部資源", "常用免費平台"];
