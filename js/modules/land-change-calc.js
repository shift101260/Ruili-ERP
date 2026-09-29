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

// 三、回饋金動態新增列 (已優化手機版卡住與擠壓問題)
window.addFeedbackRow = function() {
    const container = document.getElementById('feedback-rows-container');
    if (!container) return;
    
    // 手機版 (單欄/雙欄自適應) vs 電腦版 (6欄單橫列)
    const html = `
        <div class="feedback-row p-3 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2 md:space-y-0 md:grid md:grid-cols-[1.5fr_1fr_1fr_1.2fr_1.2fr_32px] md:gap-2 md:items-center">
            
            <!-- 地號輸入框 -->
            <div class="w-full">
                <label class="block md:hidden text-[10px] font-bold text-stone-500 mb-0.5">地號</label>
                <input type="text" placeholder="例：頂番段123地號" class="w-full box-border px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-[#C59B63]">
            </div>

            <!-- 面積與現值 (手機版排成 2 欄，電腦版拆回單欄) -->
            <div class="grid grid-cols-2 md:contents gap-2">
                <div>
                    <label class="block md:hidden text-[10px] font-bold text-stone-500 mb-0.5">面積 (㎡)</label>
                    <input type="number" step="0.01" placeholder="面積(㎡)" oninput="window.calcFeedbackTotal()" class="fb-area w-full box-border px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs font-mono focus:outline-none focus:border-[#C59B63]">
                </div>
                <div>
                    <label class="block md:hidden text-[10px] font-bold text-stone-500 mb-0.5">公告現值</label>
                    <input type="number" step="0.01" placeholder="公告現值" oninput="window.calcFeedbackTotal()" class="fb-price w-full box-border px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs font-mono focus:outline-none focus:border-[#C59B63]">
                </div>
            </div>

            <!-- 分類選單、試算結果與刪除按鈕 (手機版底部橫排) -->
            <div class="flex items-center justify-between gap-2 md:contents pt-1 md:pt-0 border-t md:border-t-0 border-stone-100">
                <div class="w-1/2 md:w-full">
                    <label class="block md:hidden text-[10px] font-bold text-stone-500 mb-0.5">類別</label>
                    <select onchange="window.calcFeedbackTotal()" class="fb-zone w-full box-border px-2 py-1.5 border border-stone-300 rounded-lg text-xs bg-white font-bold text-stone-700 focus:outline-none focus:border-[#C59B63]">
                        <option value="都內">都內 (×0.1)</option>
                        <option value="非都">非都 (×0.5)</option>
                    </select>
                </div>

                <div class="flex items-center justify-end space-x-2 md:contents w-1/2 md:w-auto">
                    <span class="fb-result font-bold text-emerald-700 text-xs font-mono text-right md:text-center shrink-0">NT$ 0</span>
                    <button type="button" onclick="this.closest('.feedback-row').remove(); window.calcFeedbackTotal();" class="text-stone-400 hover:text-rose-600 cursor-pointer p-1.5 hover:bg-rose-50 rounded-lg transition shrink-0" title="刪除">
                        <i class="fa-solid fa-trash-can text-sm"></i>
                    </button>
                </div>
            </div>

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
