// 減授課繳交狀況彙整 — 目前為示意資料
// 正式使用：依各校實際填報更新下列各列，並將 data/config.js 的 reliefDemo 改為 false
// 欄位：name校名 / n執行節數 / amt支用金額(元) / r1第一期領據 / r2第二期領據 / rpt收支結報表（true=已繳）
// 整體狀態自動判定：三項皆繳=已完成，繳一~二項=部分繳交，皆未繳=未繳交
window.DLO = window.DLO || {};
DLO.reliefStatus = [
  { name: "東南國中",           n: 120, amt: 54600,  r1: true,  r2: true,  rpt: true  },
  { name: "斗六國小",           n: 96,  amt: 38880,  r1: true,  r2: true,  rpt: true  },
  { name: "淵明國中",           n: 88,  amt: 40040,  r1: true,  r2: false, rpt: false },
  { name: "鎮西國小",           n: 110, amt: 44550,  r1: true,  r2: true,  rpt: true  },
  { name: "虎尾國小",           n: 0,   amt: 0,      r1: false, r2: false, rpt: false },
  { name: "麥寮高中（國中）",   n: 76,  amt: 34580,  r1: true,  r2: true,  rpt: true  },
  { name: "斗南高中（高中）",   n: 64,  amt: 32320,  r1: true,  r2: false, rpt: false },
  { name: "公誠國小",           n: 90,  amt: 36450,  r1: true,  r2: true,  rpt: true  },
  { name: "北港國中",           n: 58,  amt: 26390,  r1: true,  r2: true,  rpt: false },
  { name: "僑真國小",           n: 72,  amt: 29160,  r1: true,  r2: true,  rpt: true  },
  { name: "斗南國小",           n: 84,  amt: 34020,  r1: true,  r2: true,  rpt: true  },
  { name: "東明國中",           n: 0,   amt: 0,      r1: false, r2: false, rpt: false },
  { name: "西螺國小",           n: 66,  amt: 26730,  r1: true,  r2: false, rpt: false },
  { name: "土庫國小",           n: 78,  amt: 31590,  r1: true,  r2: true,  rpt: true  }
];
