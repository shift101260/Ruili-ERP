// ==========================================
// 睿立集團 ERP - 案件管理核心模組 (case-management.js)
// ==========================================

// 全域案件記憶體資料庫
let allCasesStore = [];

// 展開 / 折疊側邊欄年度選單
function toggleYearList() {
    const container = document.getElementById('year-list-container');
    const chevron = document.getElementById('year-chevron');
    if (container.classList.contains('hidden')) {
        container.classList.remove('hidden');
        chevron.classList.remove('-rotate-90');
    } else {
        container.classList.add('hidden');
        chevron.classList.add('-rotate-90');
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
        document.getElementById('edit-case-time-display').innerText = new Date().toLocaleString();
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

    // 根據工作進度自動拋轉至相對應區塊
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

// 渲染所有分區表格 (已移除操作欄位與編輯評估按鈕)
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
        const filtered = allCasesStore.filter(c => c.sectionStatus === status);

        countBadge.innerText = `${filtered.length} 件`;

        if (filtered.length === 0) {
            container.innerHTML = `<div class="p-4 text-xs text-stone-400 text-center py-6">${defaultTexts[status]}</div>`;
        } else {
            let rowsHtml = filtered.map(c => `
                <tr class="border-b border-stone-50 hover:bg-stone-50/60 transition case-item-row" data-name="${c.name}">
                    <td class="py-2.5 px-3"><input type="checkbox" class="case-checkbox" value="${c.id}"></td>
                    <td class="py-2.5 font-semibold text-stone-800">
                        <button onclick="openAddCaseModal('${c.id}')" class="hover:text-[#C59B63] hover:underline text-left font-bold cursor-pointer">
                            ${c.name}
                        </button>
                    </td>
                    <td class="py-2.5"><span class="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[10px]">${c.progressStatus || '評估中'}</span></td>
                    <td class="py-2.5 font-mono">NT$ ${Number(c.quotePrice || 0).toLocaleString()}</td>
                    <td class="py-2.5 font-mono text-rose-600 font-semibold">NT$ ${Number(c.contractPrice || 0).toLocaleString()}</td>
                    <td class="py-2.5 text-stone-600 truncate max-w-xs" title="${c.note || ''}">${c.note || '-'}</td>
                </tr>
            `).join('');

            container.innerHTML = `
                <table class="w-full text-left border-collapse">
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
            `;
        }
    });
}

// 全選/取消全選
function toggleSelectAll(sectionStatus, masterCheckbox) {
    const container = document.getElementById(`container-${sectionStatus}`);
    const checkboxes = container.querySelectorAll('.case-checkbox');
    checkboxes.forEach(cb => cb.checked = masterCheckbox.checked);
}

// 取得被勾選案件 ID 列表
function getSelectedCaseIds() {
    const checkboxes = document.querySelectorAll('.case-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// 批次拋轉案件
function batchTransferCases(targetStatus) {
    if (!targetStatus) return;
    const selectedIds = getSelectedCaseIds();
    if (selectedIds.length === 0) {
        alert('請先勾選要拋轉的案件！');
        document.getElementById('batch-action-select').value = '';
        return;
    }

    allCasesStore.forEach(c => {
        if (selectedIds.includes(c.id)) {
            c.sectionStatus = targetStatus;
        }
    });

    renderAllSections();
    document.getElementById('batch-action-select').value = '';
}

// 批次刪除案件
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

// 即時搜尋過濾
function filterCases() {
    const keyword = document.getElementById('case-search-input').value.toLowerCase().trim();
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

// 切換模組/年份選單
function switchModule(moduleName, btnElement, year) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('btn-gold', 'text-white', 'font-medium');
        btn.classList.add('hover:bg-stone-800/80', 'text-stone-300');
    });
    if (btnElement) {
        btnElement.classList.add('btn-gold', 'text-white', 'font-medium');
    }
    if (year) {
        document.getElementById('current-year-display').innerText = year;
        document.getElementById('current-year-sub').innerText = year;
    }
}
