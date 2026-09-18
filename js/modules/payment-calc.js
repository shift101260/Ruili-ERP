/**
 * 睿立集團 ERP｜財務會計與多期款自動換算模組 (payment-calc.js)
 */

/**
 * 依據簽約金額與各期 % 數，自動試算應收金額
 */
function calculateInstallments(contractAmount, percentages = [20, 20, 50, 10]) {
    let cleanAmount = typeof contractAmount === 'string' ? parseFloat(contractAmount.replace(/[^0-9.]/g, '')) : contractAmount;
    if (isNaN(cleanAmount)) cleanAmount = 0;

    return percentages.map(pct => Math.round(cleanAmount * ((pct || 0) / 100)));
}

/**
 * 自動觸發 Modal 內財務金額與各期款換算（支援 1~4 期彈性設定）
 */
function calculateQuoteTotals() {
    // 1. 供應商總計
    const rows = document.querySelectorAll('#suppliers-rows-container > div');
    let totalQuote = 0;
    let totalContract = 0;
    let totalUntaxed = 0;

    rows.forEach(row => {
        const amount = parseFloat(row.querySelector('.supplier-amount')?.value) || 0;
        const contract = parseFloat(row.querySelector('.supplier-contract')?.value) || 0;
        const untaxed = parseFloat(row.querySelector('.supplier-untaxed')?.value) || 0;
        
        totalQuote += amount;
        totalContract += contract;
        totalUntaxed += untaxed;
    });

    const totalTaxAfter = totalQuote * 1.05;
    const totalProfit = totalContract - totalUntaxed;

    const elTotal = document.getElementById('calc-total-quote');
    const elTaxAfter = document.getElementById('calc-tax-after');
    const elContractTotal = document.getElementById('calc-total-contract'); 
    const elProfit = document.getElementById('calc-total-profit');

    if (elTotal) elTotal.value = `NT$ ${totalQuote.toLocaleString()}`;
    if (elTaxAfter) elTaxAfter.value = `NT$ ${Math.round(totalTaxAfter).toLocaleString()}`;
    if (elContractTotal) elContractTotal.value = `NT$ ${totalContract.toLocaleString()}`;
    if (elProfit) elProfit.value = `NT$ ${totalProfit.toLocaleString()}`;

    // 2. 簽約金額與各期款連動
    const manualInput = document.getElementById('contract-amount');
    const manualContractAmount = manualInput ? (parseFloat(manualInput.value) || 0) : 0;

    const pcts = [];
    for (let i = 1; i <= 4; i++) {
        const pctInput = document.getElementById(`quote-inst-${i}-pct`);
        pcts.push(pctInput ? (parseFloat(pctInput.value) || 0) : 0);
    }

    const installmentValues = calculateInstallments(manualContractAmount, pcts);
    for (let i = 1; i <= 4; i++) {
        const valSpan = document.getElementById(`quote-inst-${i}-val`);
        if (valSpan) {
            const val = installmentValues[i-1];
            valSpan.innerText = `NT$ ${val.toLocaleString()}`;
            
            // 趴數為 0 時，字體變淡表示未啟用
            if (pcts[i-1] === 0) {
                valSpan.className = "text-xs text-stone-400 font-mono";
            } else {
                valSpan.className = "text-xs text-emerald-700 font-bold font-mono";
            }
        }
    }
}

window.splitPaymentSchedule = calculateInstallments;
window.calculateQuoteTotals = calculateQuoteTotals;

/**
 * 六、新增供應商列
 */
window.addQuoteSupplierRow = function(data = {}) {
    const container = document.getElementById('suppliers-rows-container');
    if (!container) {
        console.error("找不到 ID 為 'suppliers-rows-container' 的容器！");
        return;
    }

    const rowId = 'supplier-row-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);

    const html = `
        <div id="${rowId}" class="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_32px] gap-3 items-center bg-stone-50 p-3 rounded-xl border border-stone-200">
            <div>
                <input type="text" value="${data.name || ''}" placeholder="供應商名稱" class="supplier-name w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#C59B63]">
            </div>
            <div>
                <input type="text" value="${data.item || ''}" placeholder="施作項目" class="supplier-item w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#C59B63]">
            </div>
            <div>
                <input type="number" value="${data.untaxed || ''}" placeholder="未稅價格" oninput="window.calculateQuoteTotals()" class="supplier-untaxed w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#C59B63] font-mono">
            </div>
            <div>
                <input type="number" value="${data.amount || ''}" placeholder="報價金額" oninput="window.calculateQuoteTotals()" class="supplier-amount w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#C59B63] font-mono">
            </div>
            <div>
                <input type="number" value="${data.contract || ''}" placeholder="簽約金額" oninput="window.calculateQuoteTotals()" class="supplier-contract w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#C59B63] font-mono text-rose-600 font-bold">
            </div>
            <div class="flex items-center space-x-1.5">
                <input type="number" value="${data.tax !== undefined ? data.tax : 5}" oninput="window.calculateQuoteTotals()" class="supplier-tax w-14 bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs text-center font-mono">
                <span class="text-[10px] text-stone-500 font-bold">稅%</span>
            </div>
            <div class="flex justify-center">
                <button type="button" onclick="document.getElementById('${rowId}').remove(); window.calculateQuoteTotals();" class="text-stone-400 hover:text-rose-600 cursor-pointer transition">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', html);
    
    // 新增後同步計算一次總金額
    if (typeof window.calculateQuoteTotals === 'function') {
        window.calculateQuoteTotals();
    }
};
