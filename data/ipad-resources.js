// iPad 教學與維護資源 — 新增資源照格式加一行即可
// links：教學資源連結（cat 分類：官方教學 / 課堂管理 / 平台與軟體 / 進修認證）
// faq：常見問題（新進教師最常遇到的狀況）
window.DLO = window.DLO || {};
DLO.ipadLinks = [
  { cat: "官方教學", name: "數辦 iPad 使用教學影片", url: "https://www.youtube.com/watch?v=8ge7fY2r0k4", note: "雲林縣數辦錄製" },
  { cat: "官方教學", name: "數辦 MDM 管理手冊（Jamf Pro iPad）", url: "https://jelly-telescope-1ce.notion.site/Jamf-Pro-iPad-fd7abe26190e4f9e93bd71b2e6ae9294", note: "載具納管與派送設定" },
  { cat: "官方教學", name: "教育部學習載具管理系統", url: "https://mdm.edu.tw/", note: "全國 MDM 入口" },
  { cat: "課堂管理", name: "Apple「課堂」App 官方指南", url: "https://support.apple.com/guide/classroom/welcome/web", note: "鎖定畫面、開啟指定 App、螢幕檢視" },
  { cat: "課堂管理", name: "「課堂」App 部署說明（教育機構）", url: "https://support.apple.com/guide/deployment-education/edu6d39b9909/web", note: "搭配 MDM 自動建立班級" },
  { cat: "平台與軟體", name: "縣購軟體介紹", url: "https://sites.google.com/d/1ERH3ciHTNaiLuzCTD_E7BGCa_M5fjyNY/p/1i08MBR7Fb54Q4D3ebrWAQVWchciTzO_L/edit", note: "數辦彙整之縣購軟體教學" },
  { cat: "平台與軟體", name: "學習平台總覽", url: "https://www.canva.com/design/DAFh0VH7TTE/hEbdcb_WX9XJn9zZNpz4vw/view", note: "數辦彙整簡報" },
  { cat: "平台與軟體", name: "教育部因材網", url: "https://adl.edu.tw/", note: "適性學習、數據診斷" },
  { cat: "進修認證", name: "Apple Teacher 教師學習中心", url: "https://education.apple.com/", note: "免費自學課程與教師認證" },
  { cat: "進修認證", name: "數位教學講師名錄", url: "https://srl.ntue.edu.tw/Resource#a1", note: "邀請講師入校研習參考" }
];
DLO.ipadFaq = [
  { q: "iPad 忘記密碼或被鎖定怎麼辦？", a: "縣管 iPad 由 MDM（Jamf Pro）納管，請勿自行嘗試多次解鎖，逕洽校內資訊組透過 MDM 清除密碼，約數分鐘即可復原。" },
  { q: "學生 iPad 上找不到上課要用的 App？", a: "App 由 MDM 統一派送，不需輸入 Apple 帳號。請先確認 iPad 連上校內 Wi-Fi 後靜置幾分鐘；仍未出現請回報資訊組由後台重新派送。" },
  { q: "課堂 App 看不到我的班級？", a: "班級名單由 MDM 依課表自動建立。開學初名單異動期間屬正常，請確認教師 iPad 與學生 iPad 在同一網段，並回報資訊組更新班級設定。" },
  { q: "iPad 無法投影到智慧黑板？", a: "確認 iPad 與智慧黑板連同一 Wi-Fi，由控制中心開啟「螢幕鏡像」選擇教室大屏；詳見智慧黑板專區影片 07（單雙向鏡射）。" },
  { q: "iPad 摔壞或螢幕破裂？", a: "拍照記錄後依「故障報修流程」通報，切勿自行送修（影響保固）。維修期間可向學校借用備品機。" },
  { q: "iPad 遺失了怎麼辦？", a: "立即通報資訊組與數辦，由 MDM 啟動「遺失模式」鎖定並定位裝置，再依校內財產程序處理。" }
];
