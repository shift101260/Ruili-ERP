// js/modules/land-basic.js
export let landRowCount = 0;

export function addLandRow(data = {}) {
    landRowCount++;
    const rowId = `land-row-${landRowCount}`;
    const html = `
        <div id="${rowId}" class="grid grid-cols-[1fr_1fr_1.2fr_0.9fr_0.9fr_1.2fr_0.9fr_0.9fr_1fr_32px] gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm items-center text-xs">
            <input type="text" value="${data.number || ''}" placeholder="例：0899-0000" class="land-number w-full px-2 py-1 border border-slate-300 rounded-lg">
            <input type="text" value="${data.regDate || ''}" placeholder="例：112/05/20" class="land-reg-date w-full px-2 py-1 border border-slate-300 rounded-lg">
            <select class="land-zone-type w-full px-2 py-1 border border-slate-300 rounded-lg bg-white">
                <option value="都計使用分區">都計使用分區</option>
                <option value="非都使用地類別">非都使用地類別</option>
            </select>
            <input type="text" value="${data.landType || ''}" placeholder="例：建築用地" class="land-type w-full px-2 py-1 border border-slate-300 rounded-lg">
            <input type="number" value="${data.area || ''}" step="0.01" min="0" placeholder="0.00" oninput="window.calculateLandTotals()" class="land-area-input w-full px-2 py-1 border border-slate-300 rounded-lg font-mono">
            <div class="flex items-center gap-0.5">
                <input type="number" value="${data.num || 1}" min="1" oninput="window.calculateLandTotals()" class="land-num-input w-full px-1 py-1 border border-slate-300 rounded-lg text-center font-mono">
                <span>/</span>
                <input type="number" value="${data.den || 1}" min="1" oninput="window.calculateLandTotals()" class="land-den-input w-full px-1 py-1 border border-slate-300 rounded-lg text-center font-mono">
            </div>
            <input type="text" readonly class="land-sqm-output w-full px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg font-mono font-bold">
            <input type="text" readonly class="land-ping-output w-full px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg font-mono font-bold">
            <input type="text" value="${data.rights || ''}" placeholder="他項權利" class="land-rights w-full px-2 py-1 border border-slate-300 rounded-lg">
            <button type="button" onclick="document.getElementById('${rowId}').remove(); window.calculateLandTotals();" class="text-slate-400 hover:text-rose-600 cursor-pointer"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    `;
    const container = document.getElementById('land-rows-container');
    if (container) {
        container.insertAdjacentHTML('beforeend', html);
        window.calculateLandTotals();
    }
}

window.calculateLandTotals = function() {
    let totalArea = 0, totalSqm = 0;
    const rows = document.querySelectorAll('#land-rows-container > div');
    rows.forEach(row => {
        const areaVal = parseFloat(row.querySelector('.land-area-input')?.value || 0);
        const numVal = parseFloat(row.querySelector('.land-num-input')?.value || 1);
        const denVal = parseFloat(row.querySelector('.land-den-input')?.value || 1);
        const sqm = areaVal * (numVal / (denVal <= 0 ? 1 : denVal));
        const ping = sqm * 0.3025;
        
        const sqmOut = row.querySelector('.land-sqm-output');
        const pingOut = row.querySelector('.land-ping-output');
        if (sqmOut) sqmOut.value = sqm.toFixed(2);
        if (pingOut) pingOut.value = ping.toFixed(2);
        
        totalArea += areaVal;
        totalSqm += sqm;
    });

    const sumArea = document.getElementById('sum-area');
    const sumSqm = document.getElementById('sum-sqm');
    const sumPing = document.getElementById('sum-ping');
    
    if (sumArea) sumArea.textContent = `${totalArea.toFixed(2)} ㎡`;
    if (sumSqm) sumSqm.textContent = `${totalSqm.toFixed(2)} ㎡`;
    if (sumPing) sumPing.textContent = `${(totalSqm * 0.3025).toFixed(2)} 坪`;
};

window.addLandRow = addLandRow;

// 彈窗開關控制
window.openLandModal = () => {
    const modal = document.getElementById('land-modal');
    if (modal) { modal.classList.remove('hidden'); modal.style.display = 'flex'; }
};
window.closeLandModal = () => {
    const modal = document.getElementById('land-modal');
    if (modal) { modal.classList.add('hidden'); modal.style.display = 'none'; }
};

console.log('土地基本資料模組載入成功！');
