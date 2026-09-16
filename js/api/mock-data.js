/**
 * 睿立集團 ERP｜資料庫維護模組 (mock-data.js)
 * 100% 淨空版：無任何預載假案例，保持系統乾淨
 */

// 預設案件資料庫設為空陣列
const MOCK_CASES = [];

// 手動清空所有本地快取資料（還原純淨狀態）
function clearSystemData() {
    if (confirm("確定要清空所有資料，恢復為全新的空白 ERP 系統嗎？")) {
        if (typeof RuiliDataStore !== 'undefined' && RuiliDataStore.clearAll) {
            RuiliDataStore.clearAll();
        } else {
            localStorage.clear();
        }
        alert("系統已還原為空白狀態！");
        location.reload();
    }
}

// 保留防錯空函式，避免其他檔案呼叫注入時報錯
function injectMockData() {
    console.log("系統已設定為純淨模式，不載入測試假資料。");
}
