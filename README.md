# 雲林縣數位學習推動辦公室 官網平台

正式網址：https://jackize123.github.io/ylc-digital-learning/

公開資訊平台（靜態網站，GitHub Pages 託管）。**只放可公開的統計與辦法**；
各校填報、真實繳交狀況等校務資料走後台（Google 試算表 + Apps Script，規劃中），
不進此公開 repo。

## 檔案結構（頁面與資料分離）

```
index.html            網頁本體（版面與程式，平常不需要動）
data/
  config.js           年度設定與「示意資料」開關
  schools.js          全縣學校師生統計（每年更新一次）
  obs-schedule.js     公開觀課入校行程（每年依附件一更新）
  mdm-usage.js        MDM 每月載具使用率（介接教育部數據前為示意）
  relief-status.js    減授課繳交彙整（接後台前為示意）
```

## 日常維護：只改 data/ 裡的檔案

每個資料檔開頭都有欄位說明註解，用記事本或 VS Code 打開照格式改即可。

| 想更新什麼 | 改哪個檔 |
|---|---|
| 新學年師生統計 | `data/schools.js`（可請 Claude 從教育處 xlsx 直接轉檔） |
| 觀課學校、備課日/觀課日確定 | `data/obs-schedule.js`（日期填入 `"115/03/12"` 格式） |
| MDM 真實使用率 | `data/mdm-usage.js`，並把 `config.js` 的 `mdmDemo` 改 `false` |
| 減授課繳交勾稽 | `data/relief-status.js`，並把 `reliefDemo` 改 `false` |
| 年度、基準日文字 | `data/config.js` |

## 更新上線流程

```powershell
$env:PATH += ";C:\Program Files\Git\cmd"
cd C:\Users\User\.claude\數辦官網\上架用網站
git add -A
git commit -m "更新資料"
git push
```

推送後 GitHub Pages 約 1 分鐘自動重新部署。

## 大數據分析

- 三張表（學校統計／觀課行程／減授課彙整）都有「匯出 CSV」按鈕，
  匯出檔含 BOM，Excel 直接開啟不會亂碼，可供樞紐分析或匯入其他 BI 工具。
- 資料檔本身即是 JSON 結構，程式可直接讀取 `data/*.js` 做進階分析。

## 資安與帳號規劃（重要）

- 本 repo 為**公開**內容，嚴禁放入：個人資料、帳號密碼、金額明細正式數據、
  未公開之公文附件。
- 各校填報與帳號權限（198 校 + 數辦 13 + 承辦 6 + 管理 2）規劃走
  **Google 帳號網域登入**（Apps Script 部署限網域存取），不自行發放與保管密碼；
  權限以試算表角色對照表控管。詳見平台「帳號權限」頁。
