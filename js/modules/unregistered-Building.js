// js/modules/unregistered-building.js

window.openUnregisteredBuildingModal = function() {
    const modal = document.getElementById('unregistered-building-modal');
    if (modal) { modal.classList.remove('hidden'); modal.style.display = 'flex'; }
};

window.closeUnregisteredBuildingModal = function() {
    const modal = document.getElementById('unregistered-building-modal');
    if (modal) { modal.classList.add('hidden'); modal.style.display = 'none'; }
};

window.addUnregBuildingRow = function(data = {}) {
    const container = document.getElementById('unreg-building-rows-container');
    if (!container) return;
    const rowId = 'unreg-bld-' + Date.now() + Math.random().toString(36).substr(2, 5);
    
    // 6 欄網格結構，與 HTML 表頭百分之百對齊
    const html = `
        <div id="${rowId}" class="grid grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr_32px] gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm items-center text-xs">
            <input type="text" value="${data.purpose || ''}" placeholder="例：廠房後方鐵皮增建" class="unreg-purpose w-full px-2 py-1 border rounded-lg">
            <input type="text" value="${data.year || ''}" placeholder="例：2015年" class="unreg-year w-full px-2 py-1 border rounded-lg">
            <input type="number" step="0.01" min="0" value="${data.sqm || ''}" placeholder="0.00" oninput="window.calculateUnregBuildingTotals()" class="unreg-sqm-input w-full px-2 py-1 border rounded-lg font-mono">
            <input type="text" readonly class="unreg-ping-output w-full px-2 py-1 bg-slate-100 border rounded-lg font-mono font-bold">
            <input type="text" value="${data.note || ''}" placeholder="例：倉儲使用 / 可補照" class="unreg-note w-full px-2 py-1 border rounded-lg">
            <button type="button" onclick="document.getElementById('${rowId}').remove(); window.calculateUnregBuildingTotals();" class="text-slate-400 hover:text-rose-600 cursor-pointer flex justify-center"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    window.calculateUnregBuildingTotals();
};

window.calculateUnregBuildingTotals = function() {
    let totalSqm = 0;
    const rows = document.querySelectorAll('#unreg-building-rows-container > div');
    
    rows.forEach(row => {
        const sqm = parseFloat(row.querySelector('.unreg-sqm-input')?.value) || 0;
        const ping = sqm * 0.3025; // 坪數公式：平方公尺 * 0.3025

        const pingOut = row.querySelector('.unreg-ping-output');
        if (pingOut) pingOut.value = sqm > 0 ? ping.toFixed(2) : '';

        totalSqm += sqm;
    });

    const sumSqm = document.getElementById('sum-unreg-sqm');
    const sumPing = document.getElementById('sum-unreg-ping');

    if (sumSqm) sumSqm.textContent = `${totalSqm.toFixed(2)} ㎡`;
    if (sumPing) sumPing.textContent = `${(totalSqm * 0.3025).toFixed(2)} 坪`;
};

window.addUnregBuildingRow = addUnregBuildingRow;

console.log('未保存登記建物模組載入成功！');
