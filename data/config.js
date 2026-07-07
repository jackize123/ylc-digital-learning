// 平台年度設定 — 每年開學/計畫換期時更新此檔即可
window.DLO = window.DLO || {};
DLO.config = {
  portalUrl: "",                     // 填報系統 /exec 網址（Apps Script 部署後填入，官網即出現「填報系統」按鈕）
  schoolYear: "114",                 // 統計資料學年度
  dataDate: "114.12.23",             // 師生統計基準日
  reliefPeriod: "115 年 2 月 1 日至 5 月 31 日（學期間）",
  reliefDemo: true,                  // true = 繳交彙整表顯示「示意資料」標章；接上真實填報後改 false
  mdmDemo: true                      // true = MDM 使用率顯示「示意資料」標章；介接教育部數據後改 false
};
