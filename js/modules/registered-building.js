// js/modules/registered-building.js

window.openRegisteredBuildingModal = function() {
    const modal = document.getElementById('registered-building-modal');
    if (modal) { modal.classList.remove('hidden'); modal.style.display = 'flex'; }
};

window.closeRegisteredBuildingModal = function() {
    const modal = document.getElementById('registered-building-modal');
    if (modal) { modal.classList.add('hidden'); modal.style.display = 'none'; }
};

window.addRegBuildingRow = function(data = {}) {
    const container = document.getElementById('reg-building-rows-container');
    if (!container) return;
    const rowId = 'reg-bld-' + Date.now() + Math.random().toString(36).substr(2, 5);
    
    const html = `
        <div id="${rowId}" class="grid grid-cols-[1fr_1.2fr_1fr_1fr_0.9fr_1fr_0.9fr_0.9fr_32px] gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm items-center text-xs">
            <input type="text" value="${data.bldNo || ''}" placeholder="例：1234建號" class="reg-bld-no w-full px-2 py-1 border rounded-lg">
            <input type="text" value="${data.location || ''}" placeholder="例：仁武路100號" class="reg-bld-location w-full px-2 py-1 border rounded-lg">
            <input type="text" value="${data.purpose || ''}" placeholder="例：廠房" class="reg-bld-purpose w-full px-2 py-1 border rounded-lg">
            <input type="text" value="${data.regDate || ''}" placeholder="例：112/05/20" class="reg-bld-date w-full px-2 py-1 border rounded-lg">
            <input type="number" step="0.01" min="0" value="${data.area || ''}" placeholder="0.00" oninput="window.calculateRegBuildingTotals()" class="reg-bld-area w-full px-2 py-1 border rounded-lg font-mono">
            <input type="text" value="${data.rights || ''}" placeholder="1 / 1" oninput="window.calculateRegBuildingTotals()" class="reg-bld-rights w-full px-2 py-1 border rounded-lg text-center font-mono">
            <input type="text" readonly class="reg-bld-sqm w-full px-2 py-1 bg-slate-100 border rounded-lg font-mono font-bold">
            <input type="text" readonly class="reg-bld-ping w-full px-2 py-1 bg-slate-100 border rounded-lg font-mono font-bold">
            <button type="button" onclick="document.getElementById('${rowId}').remove(); window.calculateRegBuildingTotals();" class="text-slate-400 hover:text-rose-600 cursor-pointer flex justify-center"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    window.calculateRegBuildingTotals();
};

window.calculateRegBuildingTotals = function() {
    let totalArea = 0, totalSqm = 0;
    const rows = document.querySelectorAll('#reg-building-rows-container > div');
    
    rows.forEach(row => {
        const areaVal = parseFloat(row.querySelector('.reg-bld-area')?.value) || 0;
        const rightsStr = row.querySelector('.reg-bld-rights')?.value || '1/1';
        
        // 解析持分 (支援 "1/1" 或單純數字)
        let ratio = 1;
        if (rightsStr.includes('/')) {
            const parts = rightsStr.split('/');
            const num = parseFloat(parts[0]) || 1;
            const den = parseFloat(parts[1]) || 1;
            ratio = den > 0 ? num / den : 1;
        } else {
            ratio = parseFloat(rightsStr) || 1;
        }

        const sqm = areaVal * ratio;
        const ping = sqm * 0.3025;

        const sqmOut = row.querySelector('.reg-bld-sqm');
        const pingOut = row.querySelector('.reg-bld-ping');
        if (sqmOut) sqmOut.value = sqm.toFixed(2);
        if (pingOut) pingOut.value = ping.toFixed(2);

        totalArea += areaVal;
        totalSqm += sqm;
    });

    const sumArea = document.getElementById('sum-reg-area');
    const sumSqm = document.getElementById('sum-reg-sqm');
    const sumPing = document.getElementById('sum-reg-ping');

    if (sumArea) sumArea.textContent = `${totalArea.toFixed(2)} ㎡`;
    if (sumSqm) sumSqm.textContent = `${totalSqm.toFixed(2)} ㎡`;
    if (sumPing) sumPing.textContent = `${(totalSqm * 0.3025).toFixed(2)} 坪`;
};

window.addRegBuildingRow = addRegBuildingRow;

console.log('保存登記建物模組載入成功！');
