/**
 * 睿立集團 ERP｜獨立測試/示範資料庫 (mock-data.js)
 * 僅供測試與展示使用，可隨時注入或清除
 */
const MOCK_CASES = [
    {
        id: "2026-001",
        title: "林董農地變更專案",
        category: "土地變更",
        status: "SECRETARY_REVIEW", // 秘書待簽核
        amount: 3800000,
        taxIncluded: true,
        rebate: 0,
        description: "依客戶要求優先辦理初審與水保審查...",
        paymentTerms: [
            { stage: 1, percent: 30, amount: 1140000, date: "2026-10-01", remark: "簽約訂金" },
            { stage: 2, percent: 30, amount: 1140000, date: "2026-11-15", remark: "興辦事業計畫核准" },
            { stage: 3, percent: 40, amount: 1520000, date: "2026-12-30", remark: "變更完成取得公文" }
        ],
        currentRole: "secretary",
        logs: [
            { role: "秘書", time: "2026-09-16 10:00", note: "案件建立，等待簽核與登錄期程。" }
        ]
    },
    {
        id: "2026-002",
        title: "黃總經理特定工廠專案",
        category: "特定工廠專用區",
        status: "IN_PROGRESS", // 執行中
        amount: 4500000,
        taxIncluded: true,
        rebate: 50000,
        description: "配合特定工廠管理輔導法辦理用續營運計畫變更...",
        currentRole: "surveyor", // 目前地政士負責
        logs: [
            { role: "秘書", time: "2026-09-10 14:00", note: "完成簽約拋轉特助。" },
            { role: "地政士團隊", time: "2026-09-15 11:30", note: "現場測量完成，進行初審送件。" }
        ]
    }
];

// 一鍵注入假資料功能
function injectMockData() {
    if (confirm("是否要載入 2 筆測試示範案例？這會覆蓋目前的測試資料。")) {
        RuiliDataStore.saveCases(MOCK_CASES);
        alert("示範資料已成功載入！");
        location.reload();
    }
}

// 一鍵清空所有資料（回歸全新淨空系統）
function clearSystemData() {
    if (confirm("確定要清空所有資料，恢復為全新的空白 ERP 系統嗎？")) {
        RuiliDataStore.clearAll();
        alert("系統已還原為空白狀態！");
        location.reload();
    }
}
