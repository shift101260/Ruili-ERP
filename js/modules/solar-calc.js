// js/modules/solar-calc.js

window.openSolarModal = function() {
    const modal = document.getElementById('solar-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
    if (typeof window.calculateSolarAll === 'function') {
        window.calculateSolarAll();
    }
};

window.closeSolarModal = function() {
    const modal = document.getElementById('solar-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
};

window.calculateSolarAll = function() {
    // 🛡️ 護城河保護網：確保任何一處計算崩潰或 DOM 抓錯，絕不會影響其他按鈕與系統！
    try {
        // ==========================================
        // 1. 二、估算區塊計算 (初次拜訪粗估)
        // ==========================================
        const roofPing = parseFloat(document.getElementById('solar-roof-ping')?.value || 0);
        const taipowerPrice = parseFloat(document.getElementById('solar-taipower-price')?.value || 4.5);
        
        const dailyGen = (roofPing / 1.5) * (590 / 1000) * 4;
        const monthlyGen = dailyGen * 30;
        const annualGen = dailyGen * 365;
        
        const annualRev = annualGen * taipowerPrice;
        const monthlyRev = annualGen > 0 ? (annualRev / 12) : 0;

        const estB = annualRev * 0.06;
        const estRentPing = parseFloat(document.getElementById('solar-est-rent-ping')?.value || 0);
        const estRentUnitPrice = parseFloat(document.getElementById('solar-est-rent-unit-price')?.value || 0);
        const estC = estRentPing * estRentUnitPrice * 12;

        const estGreenPrice = parseFloat(document.getElementById('solar-est-green-price')?.value || 0);
        const estD = annualGen * estGreenPrice;

        let estTotalRev = annualRev + estB;
        if (estC > 0) estTotalRev += estC;
        if (estD > 0) estTotalRev += estD;

        setSolarText('res-solar-daily-gen', `${dailyGen.toFixed(1)} 度`);
        setSolarText('res-solar-monthly-gen', `${Math.round(monthlyGen).toLocaleString()} 度`);
        setSolarText('res-solar-annual-gen', `${Math.round(annualGen).toLocaleString()} 度`);
        setSolarText('res-solar-monthly-rev', `NT$ ${Math.round(monthlyRev).toLocaleString()}`);
        setSolarText('res-solar-annual-rev', `NT$ ${Math.round(annualRev).toLocaleString()}`);
        setSolarText('res-solar-est-b', `NT$ ${Math.round(estB).toLocaleString()}`);
        setSolarText('res-solar-est-c', `NT$ ${Math.round(estC).toLocaleString()}`);
        setSolarText('res-solar-est-d', `NT$ ${Math.round(estD).toLocaleString()}`);
        setSolarText('res-solar-est-total', `NT$ ${Math.round(estTotalRev).toLocaleString()}`);


        // ==========================================
        // 2. 三、精算試算區塊計算 (現勘後使用)
        // ==========================================
        const panelCount = parseFloat(document.getElementById('solar-panel-count')?.value || 0);
        const panelWatt = parseFloat(document.getElementById('solar-panel-watt')?.value || 590);
        
        const calcAnnualGen = panelCount > 0 ? (panelCount * panelWatt / 1000 * 4 * 365) : 0;
        const calcAnnualRev = calcAnnualGen * taipowerPrice;
        const calcB = calcAnnualRev * 0.06; 

        const rentPing = parseFloat(document.getElementById('solar-rent-ping')?.value || 0);
        const rentUnitPrice = parseFloat(document.getElementById('solar-rent-unit-price')?.value || 0);
        const calcC = rentPing * rentUnitPrice * 12; 

        const greenPrice = parseFloat(document.getElementById('solar-green-price')?.value || 0);
        const calcD = calcAnnualGen * greenPrice; 

        let totalRev = calcAnnualRev + calcB;
        if (calcC > 0) totalRev += calcC;
        if (calcD > 0) totalRev += calcD;

        // 3. 計算投資回收年限（建置總成本 ÷ 每年總收益）加強防呆
        const totalCost = parseFloat(document.getElementById('solar-total-cost')?.value || 0);
        let paybackYears = 0;
        
        if (totalRev > 0 && totalCost > 0) {
            paybackYears = totalCost / totalRev;
        }

        setSolarText('res-solar-calc-a', `NT$ ${Math.round(calcAnnualRev).toLocaleString()}`);
        setSolarText('res-solar-calc-b', `NT$ ${Math.round(calcB).toLocaleString()}`);
        setSolarText('res-solar-calc-c', `NT$ ${Math.round(calcC).toLocaleString()}`);
        setSolarText('res-solar-calc-d', `NT$ ${Math.round(calcD).toLocaleString()}`);
        setSolarText('res-solar-total-rev', `NT$ ${Math.round(totalRev).toLocaleString()}`);
        
        // 填入回收年限（確保大於 0 才計算，否則顯示 0.0 年避免 NaN）
        let paybackText = (paybackYears > 0 && isFinite(paybackYears)) ? `${paybackYears.toFixed(1)} 年` : '0.0 年';
        setSolarText('res-solar-payback-years', paybackText);

    } catch (error) {
        console.error("太陽能試算執行異常已被安全攔截：", error);
    }
};

// 輔助安全設定文字函式
function setSolarText(elementId, text) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = text;
}

console.log('太陽能試算模組 (solar-calc.js) - 具備防呆與回收年限之強化版本載入成功！');
