/**
 * 雲林縣數位學習推動辦公室 — 填報後台
 * 觀課填報 + 減授課調查 + 自動彙整回寫
 *
 * 部署方式（詳見 backend/後台建置說明.md）：
 *   1. 建立 Google 試算表 → 擴充功能 → Apps Script
 *   2. 貼上本檔（Code.gs）與 Index.html
 *   3. 部署 → 新增部署 → 網頁應用程式
 *      執行身分：我　／　具有存取權的使用者：網域內所有人（縣網帳號）
 *   4. 在「權限表」工作表填入各校 Email 與角色
 *
 * 資安原則：不自行發放/保管密碼，一律以 Google 帳號登入辨識；
 * 權限由「權限表」控管（學校/數辦/承辦/管理 四級）。
 */

var TZ = "Asia/Taipei";
var RELIEF_RATE = 0.0211; // 二代健保補充保費費率
var CONFIRM_FOLDER = "不請領確認書上傳"; // Drive 資料夾名稱（自動建立）

var SHEET_DEF = {
  AUTH:   { name: "權限表",   head: ["學校代碼", "學校名稱", "鄉鎮", "Email", "角色", "備註"] },
  OBS:    { name: "觀課填報", head: ["時間戳", "學校代碼", "學校名稱", "填報人", "領域", "備課日", "觀課日", "授課教師", "觀課場域", "教學設計連結", "備註"] },
  RELIEF: { name: "減授課調查", head: ["時間戳", "學校代碼", "學校名稱", "填報人", "是否請領", "執行節數", "支用金額A", "補充保費", "勞保勞退費", "確認書連結", "備註"] },
  SUM:    { name: "彙整",     head: ["學校代碼", "學校名稱", "鄉鎮", "觀課填報", "減授課調查", "執行節數", "支用金額", "第一期領據", "第二期領據", "收支結報表", "最後更新"] }
};
// 彙整表中「第一期領據/第二期領據/收支結報表」為承辦人工勾稽欄，
// 重建彙整時會依學校代碼保留人工填寫值。
var MANUAL_COLS = [8, 9, 10]; // 1-based within SUM.head

/* ═══════ 基礎 ═══════ */
function ss_() { return SpreadsheetApp.getActive(); }

function sheet_(def) {
  var sh = ss_().getSheetByName(def.name);
  if (!sh) {
    sh = ss_().insertSheet(def.name);
    sh.getRange(1, 1, 1, def.head.length).setValues([def.head]).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

function rows_(def) {
  var sh = sheet_(def);
  var last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, def.head.length).getValues();
}

function now_() { return Utilities.formatDate(new Date(), TZ, "yyyy/MM/dd HH:mm:ss"); }

function doGet() {
  ensureAll_();
  return HtmlService.createTemplateFromFile("Index").evaluate()
    .setTitle("雲林縣數辦填報系統")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

function ensureAll_() {
  Object.keys(SHEET_DEF).forEach(function (k) { sheet_(SHEET_DEF[k]); });
}

/* ═══════ 身分與權限 ═══════ */
function getContext() {
  var email = (Session.getActiveUser().getEmail() || "").toLowerCase().trim();
  var ctx = { email: email, role: "", schools: [], error: "" };
  if (!email) {
    ctx.error = "無法辨識您的 Google 帳號，請改用縣網（學校）Google 帳號登入後重試。";
    return ctx;
  }
  var auth = rows_(SHEET_DEF.AUTH);
  var hits = auth.filter(function (r) { return String(r[3]).toLowerCase().trim() === email; });
  if (!hits.length) {
    ctx.error = "您的帳號（" + email + "）尚未授權。請洽計畫承辦人將帳號加入權限表。";
    return ctx;
  }
  var rank = { "學校": 1, "數辦": 2, "承辦": 3, "管理": 4 };
  hits.forEach(function (r) {
    var role = String(r[4]).trim();
    if ((rank[role] || 0) > (rank[ctx.role] || 0)) ctx.role = role;
    if (role === "學校") ctx.schools.push({ code: String(r[0]), name: String(r[1]), town: String(r[2]) });
  });
  return ctx;
}

function requireRole_(ctx, roles) {
  if (roles.indexOf(ctx.role) === -1) throw new Error("此功能僅限「" + roles.join("、") + "」帳號使用。");
}

function schoolOf_(ctx, code) {
  var s = ctx.schools.filter(function (x) { return x.code === String(code); })[0];
  if (!s) throw new Error("您沒有這所學校的填報權限。");
  return s;
}

/* ═══════ 觀課填報 ═══════ */
function submitObs(f) {
  var ctx = getContext();
  if (ctx.error) throw new Error(ctx.error);
  requireRole_(ctx, ["學校"]);
  var s = schoolOf_(ctx, f.code);
  if (!f.obsDate || !f.domain || !f.teacher) throw new Error("觀課日、領域、授課教師為必填。");
  sheet_(SHEET_DEF.OBS).appendRow([
    now_(), s.code, s.name, ctx.email,
    String(f.domain), String(f.prepDate || ""), String(f.obsDate),
    String(f.teacher), String(f.venue || ""), String(f.planUrl || ""), String(f.memo || "")
  ]);
  rebuildSummary_();
  return "觀課資料已送出（" + s.name + "）。";
}

/* ═══════ 減授課調查 ═══════ */
function submitRelief(f) {
  var ctx = getContext();
  if (ctx.error) throw new Error(ctx.error);
  requireRole_(ctx, ["學校"]);
  var s = schoolOf_(ctx, f.code);
  var claim = f.claim === "N" ? "不請領" : "請領";
  var n = 0, amt = 0, fee = 0, labor = 0, link = "";
  if (claim === "請領") {
    n = Math.round(Number(f.n));
    amt = Math.round(Number(f.amt));
    labor = Math.round(Number(f.labor) || 0);
    if (!(n >= 0) || !(amt >= 0)) throw new Error("節數與金額必須為 0 以上的數字（如無請填 0）。");
    fee = Math.round(amt * RELIEF_RATE);
  } else if (f.fileB64) {
    link = saveConfirmFile_(s, f.fileB64, f.fileName, f.fileType);
  }
  sheet_(SHEET_DEF.RELIEF).appendRow([
    now_(), s.code, s.name, ctx.email, claim, n, amt, fee, labor, link, String(f.memo || "")
  ]);
  rebuildSummary_();
  return claim === "不請領"
    ? "不請領確認已送出" + (link ? "，核章檔已上傳。" : "（請記得補上傳核章後的確認書）。")
    : "減授課調查已送出：" + n + " 節、" + amt + " 元（補充保費 " + fee + " 元）。";
}

function saveConfirmFile_(s, b64, name, mime) {
  var folders = DriveApp.getFoldersByName(CONFIRM_FOLDER);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(CONFIRM_FOLDER);
  var blob = Utilities.newBlob(Utilities.base64Decode(b64), mime || "application/pdf",
    s.code + "_" + s.name + "_" + (name || "確認書.pdf"));
  var file = folder.createFile(blob);
  return file.getUrl();
}

/* ═══════ 我的填報紀錄 ═══════ */
function getMyRecords() {
  var ctx = getContext();
  if (ctx.error) throw new Error(ctx.error);
  var codes = ctx.schools.map(function (s) { return s.code; });
  var mine = function (r) { return codes.indexOf(String(r[1])) !== -1; };
  return {
    obs: rows_(SHEET_DEF.OBS).filter(mine).map(function (r) {
      return { t: r[0], school: r[2], domain: r[4], prep: r[5], obs: r[6], teacher: r[7] };
    }),
    relief: rows_(SHEET_DEF.RELIEF).filter(mine).map(function (r) {
      return { t: r[0], school: r[2], claim: r[4], n: r[5], amt: r[6], fee: r[7], labor: r[8], link: r[9] };
    })
  };
}

/* ═══════ 自動彙整回寫 ═══════ */
function rebuildSummary_() {
  var auth = rows_(SHEET_DEF.AUTH).filter(function (r) { return String(r[4]).trim() === "學校"; });
  var seen = {}, schools = [];
  auth.forEach(function (r) {
    var code = String(r[0]);
    if (!seen[code]) { seen[code] = true; schools.push({ code: code, name: String(r[1]), town: String(r[2]) }); }
  });
  var obs = rows_(SHEET_DEF.OBS), relief = rows_(SHEET_DEF.RELIEF);
  var sumSheet = sheet_(SHEET_DEF.SUM);
  // 保留人工勾稽欄（依學校代碼）
  var manual = {};
  rows_(SHEET_DEF.SUM).forEach(function (r) {
    manual[String(r[0])] = MANUAL_COLS.map(function (c) { return r[c - 1]; });
  });
  var out = schools.map(function (s) {
    var hasObs = obs.some(function (r) { return String(r[1]) === s.code; });
    var latest = null;
    relief.forEach(function (r) { if (String(r[1]) === s.code) latest = r; }); // 依填報順序取最後一筆
    var m = manual[s.code] || ["未繳", "未繳", "未繳"];
    return [
      s.code, s.name, s.town,
      hasObs ? "已填報" : "未填報",
      latest ? String(latest[4]) + "已填" : "未填報",
      latest ? latest[5] : "", latest ? latest[6] : "",
      m[0] || "未繳", m[1] || "未繳", m[2] || "未繳",
      now_()
    ];
  });
  var head = SHEET_DEF.SUM.head;
  sumSheet.clearContents();
  sumSheet.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight("bold");
  if (out.length) sumSheet.getRange(2, 1, out.length, head.length).setValues(out);
}

function getSummary() {
  var ctx = getContext();
  if (ctx.error) throw new Error(ctx.error);
  requireRole_(ctx, ["數辦", "承辦", "管理"]);
  rebuildSummary_();
  var rows = rows_(SHEET_DEF.SUM);
  var stat = { total: rows.length, obsDone: 0, reliefDone: 0 };
  rows.forEach(function (r) {
    if (r[3] === "已填報") stat.obsDone++;
    if (String(r[4]).indexOf("已填") !== -1) stat.reliefDone++;
  });
  return { stat: stat, rows: rows };
}

/** 產生前台 data/relief-status.js 檔案內容（承辦/管理），
 *  複製貼回官網 repo 的 data/relief-status.js 後 git push 即完成回寫。 */
function buildFrontendData() {
  var ctx = getContext();
  if (ctx.error) throw new Error(ctx.error);
  requireRole_(ctx, ["承辦", "管理"]);
  rebuildSummary_();
  var rows = rows_(SHEET_DEF.SUM);
  var items = rows.map(function (r) {
    return "  { name: " + JSON.stringify(String(r[1])) +
      ", n: " + (Number(r[5]) || 0) + ", amt: " + (Number(r[6]) || 0) +
      ", r1: " + (r[7] === "已繳") + ", r2: " + (r[8] === "已繳") + ", rpt: " + (r[9] === "已繳") + " }";
  });
  return "// 減授課繳交狀況彙整 — 由填報系統於 " + now_() + " 產生\n" +
    "// 貼回官網 repo 的 data/relief-status.js，並確認 data/config.js 的 reliefDemo 已改為 false\n" +
    "window.DLO = window.DLO || {};\n" +
    "DLO.reliefStatus = [\n" + items.join(",\n") + "\n];\n";
}

/* ═══════ 提醒信 ═══════ */
function sendReminders(kind) {
  var ctx = getContext();
  if (ctx.error) throw new Error(ctx.error);
  requireRole_(ctx, ["承辦", "管理"]);
  rebuildSummary_();
  var col = kind === "obs" ? 3 : 4;
  var label = kind === "obs" ? "公開觀課填報" : "減授課經費支用調查";
  var missing = rows_(SHEET_DEF.SUM).filter(function (r) { return String(r[col]).indexOf("未填") !== -1; });
  var auth = rows_(SHEET_DEF.AUTH);
  var sent = 0;
  missing.forEach(function (m) {
    var accts = auth.filter(function (a) {
      return String(a[0]) === String(m[0]) && String(a[4]).trim() === "學校" && String(a[3]).indexOf("@") !== -1;
    });
    accts.forEach(function (a) {
      GmailApp.sendEmail(String(a[3]),
        "【雲林縣數辦】" + label + " 填報提醒（" + m[1] + "）",
        m[1] + " 您好：\n\n貴校尚未完成「" + label + "」，請於期限內至填報系統完成填報：\n" +
        ScriptApp.getService().getUrl() +
        "\n\n若已不適用或有疑問，請逕洽雲林縣數位學習推動辦公室。\n（此信由系統自動寄發）");
      sent++;
    });
  });
  return "已寄出 " + sent + " 封提醒信（未填報學校 " + missing.length + " 所）。";
}
