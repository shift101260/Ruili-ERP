// ==========================================
// 睿立集團 ERP - 案件管理與 RWD 手機控制模組 (case-management.js)
// ==========================================

// 全域案件記憶體資料庫
let allCasesStore = [];

// 📱 手機版側邊欄開關
function toggleSidebar() {
    const sidebar = document.querySelector('.ruili-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('mobile-open');
    }
}

// 💡 手機版點擊任何導覽按鈕後，自動收起側邊欄
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.nav-btn');
    if (btn && window.innerWidth < 768) {
        const sidebar = document.querySelector('.ruili-sidebar');
        if (sidebar && sidebar.classList.contains('mobile-open')) {
            toggleSidebar();
        }
    }
});

// 展開 / 折疊側邊欄年度選單
function toggleYearList() {
    const container = document.getElementById('year-list-container');
    const chevron = document.getElementById('year-chevron');
    if (container) {
        if (container.classList.contains('hidden')) {
            container.classList.remove('hidden');
            if (chevron) chevron.classList.remove('-rotate-90');
        } else {
            container.classList.add('hidden');
            if (chevron) chevron.classList.add('-rotate-90');
        }
    }
}

// 關閉 Modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
}

// 開啟建檔/編輯案件 Modal
function openAddCaseModal(caseId = null) {
    const modal = document.getElementById('editCaseModal');
    if (!modal) return;

    if (caseId) {
        const targetCase = allCasesStore.find(c => c.id === caseId);
        if (targetCase) {
            document.getElementById('edit-case-id').value = targetCase.id;
            document.getElementById('edit-case-name').value = targetCase.name || '';
            document.getElementById('edit-case-service-detail').value = targetCase.serviceDetail || '';
            document.getElementById('edit-case-progress-status').value = targetCase.progressStatus || '評估中';
            document.getElementById('quote-price-amount').value = targetCase.quotePrice || '';
            document.getElementById('contract-amount').value = targetCase.contractPrice || '';
            document.getElementById('edit-case-note').value = targetCase.note || '';
        }
    } else {
        document.getElementById('edit-case-id').value = '';
        document.getElementById('edit-case-name').value = '';
        document.getElementById('edit-case-service-detail').value = '';
        document.getElementById('edit-case-progress-status').value = '評估中';
        document.getElementById('quote-price-amount').value = '';
        document.getElementById('contract-amount').value = '';
        document.getElementById('edit-case-note').value = '';
        const timeDisplay = document.getElementById('edit-case-time-display');
        if (timeDisplay) timeDisplay.innerText = new Date().toLocaleString();
    }
    modal.classList.remove('hidden');
}

// 儲存案件
function saveNewCase() {
    const id = document.getElementById('edit-case-id').value || 'case-' + Date.now();
    const name = document.getElementById('edit-case-name').value.trim();
    const serviceDetail = document.getElementById('edit-case-service-detail').value.trim();
    const progressStatus = document.getElementById('edit-case-progress-status').value;
    const quotePrice = document.getElementById('quote-price-amount').value;
    const contractPrice = document.getElementById('contract-amount').value;
    const note = document.getElementById('edit-case-note').value.trim();

    if (!name) {
        alert('請輸入案件名稱！');
        return;
    }

    let sectionStatus = 'EVALUATION';
    if (progressStatus === '簽約中') sectionStatus = 'CONTRACTING';
    else if (progressStatus === '結案中') sectionStatus = 'CLOSED';
    else if (progressStatus === '廢件') sectionStatus = 'JUNK';

    const existingIndex = allCasesStore.findIndex(c => c.id === id);
    const caseData = {
        id,
        name,
        serviceDetail,
        progressStatus,
        sectionStatus,
        quotePrice,
        contractPrice,
        note
    };

    if (existingIndex >= 0) {
        allCasesStore[existingIndex] = caseData;
    } else {
        allCasesStore.push(caseData);
    }

    renderAllSections();
    closeModal('editCaseModal');
}

// 渲染案件管理基礎頁面骨架 (強制重構 HTML 以確保切換順暢)
function renderCaseManagementView(year = 2026) {
    const container = document.getElementById('app-container');
    if (!container) return;

    // 強制重寫案件管理的主架構
    container.innerHTML = `
        <header class="card-frame p-4 sm:p-5 mb-5 flex justify-between items-center">
            <div>
                <h2 id="page-title" class="text-base sm:text-lg font-bold text-stone-800 flex items-center gap-2 tracking-wide">
                    <span id="current-year-display">${year}</span> 年度案件管理中心
                </h2>
                <p class="text-xs text-stone-500 mt-1">
                    管理 <span id="current-year-sub" class="font-medium">${year}</span> 年度案件，支援關鍵字搜尋、勾選、刪除、恢復與狀態跨區塊拋轉。
                </p>
            </div>
            
            <div class="flex items-center gap-2 sm:gap-3">
                <div class="relative">
                    <input type="text" id="case-search-input" oninput="filterCases()" placeholder="搜尋案件..." class="pl-3 pr-8 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#C59B63] transition w-full sm:w-48">
                    <i class="fa-solid fa-magnifying-glass absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
                </div>
                
                <select id="batch-action-select" onchange="batchTransferCases(this.value)" class="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-[#C59B63] text-stone-700">
                    <option value="">-- 拋轉至 --</option>
                    <option value="EVALUATION">案件評估</option>
                    <option value="CONTRACTING">簽約案件</option>
                    <option value="CLOSED">結案中心</option>
                    <option value="JUNK">廢件專區</option>
                    <option value="FAILED">案件失敗</option>
                </select>

                <button onclick="batchDeleteCases()" class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-xs font-medium border border-stone-300 transition flex items-center gap-1 cursor-pointer">
                    <i class="fa-solid fa-trash-can text-stone-500"></i>刪除
                </button>
                <button onclick="location.reload()" class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-xs font-medium border border-stone-300 transition flex items-center gap-1 cursor-pointer">
                    <i class="fa-solid fa-rotate-left text-stone-500"></i>恢復
                </button>
                <button onclick="openAddCaseModal()" class="px-4 py-1.5 btn-gold rounded-md text-xs font-medium shadow-2xs transition flex items-center gap-1 cursor-pointer whitespace-nowrap">
                    <i class="fa-solid fa-plus"></i>新增
                </button>
            </div>
        </header>

        <div class="space-y-4">
            <div class="card-frame overflow-hidden">
                <div class="px-5 py-3 border-b border-stone-100 flex items-center justify-between bg-white">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <h3 class="text-xs font-bold text-stone-800">案件評估</h3>
                    </div>
                    <span id="count-EVALUATION" class="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200/60">0 件</span>
                </div>
                <div id="container-EVALUATION" class="p-4 text-xs text-stone-400 text-center py-6">目前無案件評估紀錄</div>
            </div>

            <div class="card-frame overflow-hidden">
                <div class="px-5 py-3 border-b border-stone-100 flex items-center justify-between bg-white">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        <h3 class="text-xs font-bold text-stone-800">簽約案件</h3>
                    </div>
                    <span id="count-CONTRACTING" class="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200/60">0 件</span>
                </div>
                <div id="container-CONTRACTING" class="p-4 text-xs text-stone-400 text-center py-6">目前無簽約案件記錄</div>
            </div>

            <div class="card-frame overflow-hidden">
                <div class="px-5 py-3 border-b border-stone-100 flex items-center justify-between bg-white">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <h3 class="text-xs font-bold text-stone-800">結案中心</h3>
                    </div>
                    <span id="count-CLOSED" class="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200/60">0 件</span>
                </div>
                <div id="container-CLOSED" class="p-4 text-xs text-stone-400 text-center py-6">目前無結案紀錄</div>
            </div>

            <div class="card-frame overflow-hidden">
                <div class="px-5 py-3 border-b border-stone-100 flex items-center justify-between bg-white">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-stone-400"></span>
                        <h3 class="text-xs font-bold text-stone-800">廢件專區</h3>
                    </div>
                    <span id="count-JUNK" class="text-xs font-semibold bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full border border-stone-200">0 件</span>
                </div>
                <div id="container-JUNK" class="p-4 text-xs text-stone-400 text-center py-6">目前無相關廢件紀錄</div>
            </div>

            <div class="card-frame overflow-hidden">
                <div class="px-5 py-3 border-b border-stone-100 flex items-center justify-between bg-white">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                        <h3 class="text-xs font-bold text-stone-800">案件失敗</h3>
                    </div>
                    <span id="count-FAILED" class="text-xs font-semibold bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-200/60">0 件</span>
                </div>
                <div id="container-FAILED" class="p-4 text-xs text-stone-400 text-center py-6">目前無相關失敗紀錄</div>
            </div>
        </div>
    `;
}

// 渲染所有分區表格
function renderAllSections() {
    const sections = ['EVALUATION', 'CONTRACTING', 'CLOSED', 'JUNK', 'FAILED'];
    const defaultTexts = {
        'EVALUATION': '目前無案件評估紀錄',
        'CONTRACTING': '目前無簽約案件記錄',
        'CLOSED': '目前無結案紀錄',
        'JUNK': '目前無相關廢件紀錄',
        'FAILED': '目前無相關失敗紀錄'
    };

    sections.forEach(status => {
        const container = document.getElementById(`container-${status}`);
        const countBadge = document.getElementById(`count-${status}`);
        if (!container || !countBadge) return;

        const filtered = allCasesStore.filter(c => c.sectionStatus === status);

        countBadge.innerText = `${filtered.length} 件`;

        if (filtered.length === 0) {
            container.innerHTML = `<div class="p-4 text-xs text-stone-400 text-center py-6">${defaultTexts[status]}</div>`;
        } else {
            let rowsHtml = filtered.map(c => `
                <tr class="border-b border-stone-50 hover:bg-stone-50/60 transition case-item-row" data-name="${c.name}">
                    <td class="py-2.5 px-3"><input type="checkbox" class="case-checkbox" value="${c.id}"></td>
                    <td class="py-2.5 font-semibold text-stone-800">
                        <button onclick="openAddCaseModal('${c.id}')" class="hover:text-[#C59B63] hover:underline text-left font-bold cursor-pointer whitespace-nowrap">
                            ${c.name}
                        </button>
                    </td>
                    <td class="py-2.5 whitespace-nowrap"><span class="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[10px]">${c.progressStatus || '評估中'}</span></td>
                    <td class="py-2.5 font-mono whitespace-nowrap">NT$ ${Number(c.quotePrice || 0).toLocaleString()}</td>
                    <td class="py-2.5 font-mono text-rose-600 font-semibold whitespace-nowrap">NT$ ${Number(c.contractPrice || 0).toLocaleString()}</td>
                    <td class="py-2.5 text-stone-600 truncate max-w-xs" title="${c.note || ''}">${c.note || '-'}</td>
                </tr>
            `).join('');

            container.innerHTML = `
                <div class="table-scroll-container">
                    <table class="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr class="text-[11px] text-stone-400 border-b border-stone-100">
                                <th class="py-2 w-8 px-3"><input type="checkbox" onclick="toggleSelectAll('${status}', this)"></th>
                                <th class="py-2">案件名稱</th>
                                <th class="py-2">工作進度</th>
                                <th class="py-2">報價金額</th>
                                <th class="py-2">簽約金額</th>
                                <th class="py-2">案件即時說明</th>
                            </tr>
                        </thead>
                        <tbody class="text-xs text-stone-700">${rowsHtml}</tbody>
                    </table>
                </div>
            `;
        }
    });
}

function toggleSelectAll(sectionStatus, masterCheckbox) {
    const container = document.getElementById(`container-${sectionStatus}`);
    if (!container) return;
    const checkboxes = container.querySelectorAll('.case-checkbox');
    checkboxes.forEach(cb => cb.checked = masterCheckbox.checked);
}

function getSelectedCaseIds() {
    const checkboxes = document.querySelectorAll('.case-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function batchTransferCases(targetStatus) {
    if (!targetStatus) return;
    const selectedIds = getSelectedCaseIds();
    if (selectedIds.length === 0) {
        alert('請先勾選要拋轉的案件！');
        const sel = document.getElementById('batch-action-select');
        if (sel) sel.value = '';
        return;
    }

    allCasesStore.forEach(c => {
        if (selectedIds.includes(c.id)) {
            c.sectionStatus = targetStatus;
        }
    });

    renderAllSections();
    const sel = document.getElementById('batch-action-select');
    if (sel) sel.value = '';
}

function batchDeleteCases() {
    const selectedIds = getSelectedCaseIds();
    if (selectedIds.length === 0) {
        alert('請先勾選要刪除的案件！');
        return;
    }

    if (confirm(`確定要刪除選取的 ${selectedIds.length} 筆案件嗎？`)) {
        allCasesStore = allCasesStore.filter(c => !selectedIds.includes(c.id));
        renderAllSections();
    }
}

function filterCases() {
    const input = document.getElementById('case-search-input');
    if (!input) return;
    const keyword = input.value.toLowerCase().trim();
    const rows = document.querySelectorAll('.case-item-row');
    rows.forEach(row => {
        const name = row.getAttribute('data-name').toLowerCase();
        if (name.includes(keyword)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// 頁面與模組切換主控制邏輯
function switchModule(moduleName, btnElement, year) {
    // 1. 切換選單按鈕高亮樣式
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('btn-gold', 'text-white', 'font-medium');
        btn.classList.add('hover:bg-stone-800/80', 'text-stone-300');
    });
    if (btnElement) {
        btnElement.classList.add('btn-gold', 'text-white', 'font-medium');
    }

    // 2. 切換至「工具專區」
    if (moduleName === 'tools-module') {
        if (typeof window.renderToolsModule === 'function') {
            window.renderToolsModule();
        } else {
            console.error("找不到 renderToolsModule 函數，請確認 index.html 底部已引入 tools-module.js");
        }
        return;
    }

    // 3. 切換至「案件管理」或「年度切換」
    const currentYear = year || 2026;
    renderCaseManagementView(currentYear);

    const yearDisplay = document.getElementById('current-year-display');
    const yearSub = document.getElementById('current-year-sub');
    if (yearDisplay) yearDisplay.innerText = currentYear;
    if (yearSub) yearSub.innerText = currentYear;

    renderAllSections();
}

// 掛載所有函數至全域 window，確保 HTML onclick 能無縫調用
window.toggleSidebar = toggleSidebar;
window.toggleYearList = toggleYearList;
window.closeModal = closeModal;
window.openAddCaseModal = openAddCaseModal;
window.saveNewCase = saveNewCase;
window.renderCaseManagementView = renderCaseManagementView;
window.renderAllSections = renderAllSections;
window.toggleSelectAll = toggleSelectAll;
window.batchTransferCases = batchTransferCases;
window.batchDeleteCases = batchDeleteCases;
window.filterCases = filterCases;
window.switchModule = switchModule;
