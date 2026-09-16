/**
 * 開啟集團案件完整建檔與評估中心（八大區塊彈窗）- 新增/編輯模式
 */
function openAddCaseModal(year = '2026') { 
    const yearInput = document.getElementById('edit-case-year'); 
    const idInput = document.getElementById('edit-case-id'); 

    // 取得當前畫面上選取的年份，優先作為預設年份
    const currentYearDisplay = document.getElementById('current-year-display');
    const targetYear = currentYearDisplay ? currentYearDisplay.innerText.trim() : year;

    if (yearInput) yearInput.value = targetYear; 
    if (idInput) idInput.value = ''; // 留空代表新增模式 

    // 1. 清空文字與數字輸入欄位 
    const fieldsToClear = [
        'edit-case-name',
        'edit-case-service-detail',
        'edit-case-address',
        'edit-case-land-number',  // 修正為 HTML 中的正確 ID
        'edit-case-desc',
        'edit-case-note',
        'quote-price-amount',
        'quote-price-percent',
        'contract-amount',         // 修正簽約金額 ID
        'contract-percent',
        'referral-name',
        'referral-commission',
        'referral-mechanism',
        'contract-business-note'
    ];

    fieldsToClear.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    // 2. 還原下拉選單預設值
    const progressSelect = document.getElementById('edit-case-progress-status');
    const serviceSelect = document.getElementById('edit-case-service');
    if (progressSelect) progressSelect.selectedIndex = 0;
    if (serviceSelect) serviceSelect.selectedIndex = 0;

    // 3. 還原四期款預設趴數 (20%, 20%, 50%, 10%) 與清空日期/備註
    const defaultPcts = [20, 20, 50, 10];
    for (let i = 1; i <= 4; i++) {
        const pctEl = document.getElementById(`quote-inst-${i}-pct`);
        const dateEl = document.getElementById(`quote-inst-${i}-date`);
        const noteEl = document.getElementById(`quote-inst-${i}-note`);
        
        if (pctEl) pctEl.value = defaultPcts[i-1];
        if (dateEl) dateEl.value = '';
        if (noteEl) noteEl.value = '';
    }

    // 4. 重置供應商列 (保留並清空預設第一列)
    const suppliersContainer = document.getElementById('suppliers-rows-container');
    if (suppliersContainer) {
        suppliersContainer.innerHTML = `
            <div id="supplier-row-default" class="grid grid-cols-6 gap-3 items-center bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div><input type="text" placeholder="供應商名稱" class="supplier-name w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-ruili-brand"></div>
                <div><input type="text" placeholder="施作項目" class="supplier-item w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-ruili-brand"></div>
                <div><input type="number" placeholder="未稅價格" oninput="calculateQuoteTotals()" class="supplier-untaxed w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-ruili-brand font-mono"></div>
                <div><input type="number" placeholder="報價金額" oninput="calculateQuoteTotals()" class="supplier-amount w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-ruili-brand font-mono"></div>
                <div><input type="number" placeholder="簽約金額" oninput="calculateQuoteTotals()" class="supplier-contract w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-ruili-brand font-mono text-rose-600 font-bold"></div>
                <div class="flex items-center space-x-2">
                    <input type="number" value="5" oninput="calculateQuoteTotals()" class="supplier-tax w-14 bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs text-center font-mono">
                    <button type="button" onclick="document.getElementById('supplier-row-default').remove(); calculateQuoteTotals();" class="px-2.5 py-1.5 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-xl text-xs font-bold transition">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // 5. 重新觸發財務四期款與利潤自動換算 (全部歸零)
    if (typeof window.calculateQuoteTotals === 'function') {
        window.calculateQuoteTotals();
    }

    // 6. 顯示 Modal 彈窗
    const modal = document.getElementById('editCaseModal'); 
    if (modal) modal.classList.remove('hidden'); 
}

// 綁定全域 window 物件，確保在 HTML 的 onclick 可以直接調用
window.openAddCaseModal = openAddCaseModal;
