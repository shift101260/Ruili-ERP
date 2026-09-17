// ==========================================================
// 土地變更評估與回饋金試算完整邏輯 (js/modules/land-change-calc.js)
// ==========================================================

window.openLandChangeModal = () => {
    const modal = document.getElementById('land-change-modal');
    if (modal) { modal.classList.remove('hidden'); modal.style.display = 'flex'; }
};

window.closeLandChangeModal = () => {
    const modal = document.getElementById('land-change-modal');
    if (modal) { modal.classList.add('hidden'); modal.style.display = 'none'; }
};

// 二、工廠面積自動換算坪數 (*0.3025)
window.calcFactoryArea = function(input) {
    const parent = input.closest('div.p-3');
    if (!parent) return;
    const sqm = parseFloat(input.value) || 0;
    const pingInput = parent.querySelector('.factory-ping');
    if (pingInput) {
        pingInput.value = sqm > 0 ? (sqm * 0.3025).toFixed(2) + ' 坪' : '';
    }
};

// 舊版相容
window.calcPing = function(inputEl, outputId) {
    const val = parseFloat(inputEl.value || 0);
    const target = document.getElementById(outputId);
    if (target) target.value = `${(val * 0.3025).toFixed(2)} 坪`;
};

// 三、回饋金動態新增列
window.addFeedbackRow = function() {
    const container = document.getElementById('feedback-rows-container');
    if (!container) return;
    const html = `
        <div class="feedback-row grid grid-cols-[1.5fr_1fr_1fr_1.2fr_1.2fr_32px] gap-2 items-center bg-white p-2 rounded-lg border shadow-sm">
            <input type="text" placeholder="例：頂番段123地號" class="px-2 py-1 border rounded-lg text-xs">
            <input type="number" step="0.01" placeholder="面積(㎡)" oninput="window.calcFeedbackTotal()" class="fb-area px-2 py-1 border rounded-lg text-xs font-mono">
            <input type="number" step="0.01" placeholder="公告現值" oninput="window.calcFeedbackTotal()" class="fb-price px-2 py-1 border rounded-lg text-xs font-mono">
            <select onchange="window.calcFeedbackTotal()" class="fb-zone px-2 py-1 border rounded-lg text-xs bg-white font-medium">
                <option value="都內">都內 (×0.1)</option>
                <option value="非都">非都 (×0.5)</option>
            </select>
            <span class="fb-result font-bold text-emerald-700 text-xs font-mono text-center">NT$ 0</span>
            <button type="button" onclick="this.closest('.feedback-row').remove(); window.calcFeedbackTotal();" class="text-slate-400 hover:text-rose-600 cursor-pointer flex justify-center"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
};

// 三、回饋金試算公式計算（都內 *0.1，非都 *0.5）
window.calcFeedbackTotal = function() {
    let grandTotal = 0;
    const rows = document.querySelectorAll('.feedback-row');
    rows.forEach(row => {
        const area = parseFloat(row.querySelector('.fb-area')?.value) || 0;
        const price = parseFloat(row.querySelector('.fb-price')?.value) || 0;
        const zone = row.querySelector('.fb-zone')?.value;
         
        let subtotal = 0;
        if (zone === '都內') {
            subtotal = area * price * 0.1;
        } else if (zone === '非都') {
            subtotal = area * price * 0.5;
        }
         
        const resultSpan = row.querySelector('.fb-result');
        if (resultSpan) {
            resultSpan.textContent = `NT$ ${Math.round(subtotal).toLocaleString()}`;
        }
        grandTotal += subtotal;
    });

    const grandTotalSpan = document.getElementById('feedback-grand-total');
    if (grandTotalSpan) {
        grandTotalSpan.textContent = `NT$ ${Math.round(grandTotal).toLocaleString()}`;
    }
};

// 四、都內土地代金計算公式（面積 * 0.3 * 公告現值 * 0.5）
window.calcUrbanAltTotal = function() {
    const area = parseFloat(document.getElementById('urban-alt-area')?.value) || 0;
    const price = parseFloat(document.getElementById('urban-alt-price')?.value) || 0;
    const subtotal = area * 0.3 * price * 0.5;
    
    const resultInput = document.getElementById('urban-alt-result');
    if (resultInput) {
        resultInput.value = `NT$ ${Math.round(subtotal).toLocaleString()}`;
    }
};
