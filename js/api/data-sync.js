/**
 * 睿立集團 ERP｜資料同步與 LocalStorage 管理模組 (data-sync.js)
 */
const RuiliDataStore = {
    STORAGE_KEY: 'ruili_erp_cases_v2',

    // 1. 取得所有案件（若無資料則安全回傳空陣列）
    getCases: function() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("讀取資料失敗:", e);
            return [];
        }
    },

    // 2. 儲存/更新案件列表
    saveCases: function(cases) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cases));
            window.dispatchEvent(new Event('ruili-data-updated')); // 觸發全域更新通知
            return true;
        } catch (e) {
            console.error("儲存資料失敗:", e);
            return false;
        }
    },

    // 3. 新增單筆案件
    addCase: function(newCase) {
        const cases = this.getCases();
        cases.unshift(newCase);
        return this.saveCases(cases);
    },

    // 4. 清空所有案件（還原純淨系統）
    clearAll: function() {
        localStorage.removeItem(this.STORAGE_KEY);
        window.dispatchEvent(new Event('ruili-data-updated'));
    }
};

// 掛載至全域 window 物件
window.RuiliDataStore = RuiliDataStore;
