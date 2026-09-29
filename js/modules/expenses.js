// ==========================================
// 睿立集團 ERP - 自填支出模組 (expenses.js)
// ==========================================

// 預設支出項目選項
const EXPENSE_CATEGORIES = [
    '規費',
    '稅金',
    '交際費',
    '差旅費',
    '郵電費',
    '廣告費',
    '交通補貼',
    '文具用品',
    '其他費用'
];

// 五位成員
const EXPENSE_MEMBERS = ['楊裕憲', '陳宥騰', '鄭家承', '樊靖畇', '楊淯淳'];

// 當前選取狀態
let currentExpenseYear = new Date().getFullYear();
let currentExpenseMember = '楊裕憲';

// 取得該年度資料檔案
function getExpenseData(year) {
    const storageKey = `ruili_expenses_${year}`;
    const rawData = localStorage.getItem(storageKey);
    if (!rawData) {
        // 初始獨立資料結構
        const defaultData = {
            '楊裕憲': [],
            '陳宥騰': [],
            '鄭家承': [],
            '樊靖畇': [],
            '楊淯淳': []
        };
        localStorage.setItem(storageKey, JSON.stringify(defaultData));
        return defaultData;
    }
    return JSON.parse(rawData);
}

// 儲存該年度資料檔案
function saveExpenseData(year, data) {
    const storageKey = `ruili_expenses_${year}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
}

// 主渲染函式
function renderExpensesModule() {
    const container = document.getElementById('app-container');
    if (!container) return;

    // 更新頁面標題（若有標題列）
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.innerText = '自填支出管理與分析';
    }

    const data = getExpenseData(currentExpenseYear);

    // 算各人員當年度總金額
    const memberTotals = {};
    let grandTotal = 0;
    EXPENSE_MEMBERS.forEach(m => {
        const total = (data[m] || []).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        memberTotals[m] = total;
        grandTotal += total;
    });

    // 算項目統計比例 (全體)
    const categoryStats = {};
    let totalItemsCount = 0;

    EXPENSE_MEMBERS.forEach(m => {
        (data[m] || []).forEach(item => {
            const cat = item.category || '其他';
            const amt = Number(item.amount) || 0;
            if (!categoryStats[cat]) {
                categoryStats[cat] = { count: 0, amount: 0 };
            }
            categoryStats[cat].count += 1;
            categoryStats[cat].amount += amt;
            totalItemsCount += 1;
        });
    });

    // 關鍵修改：外層容器標籤完全對齊 tools-module.js
    container.innerHTML = `
        <div class="space-y-8 max-w-7xl mx-auto pb-12">
            
            <!-- 1. 頂部控制列：年度切換與成員切換 -->
            <div class="card-frame p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg font-bold shrink-0">
                        <i class="fa-solid fa-receipt"></i>
                    </div>
                    <div>
                        <h2 class="text-base font-bold text-stone-800">自填支出管理</h2>
                        <p class="text-xs text-stone-500">獨立年度檔案存檔，支援成員個人明細與全體分析統計</p>
                    </div>
                </div>

                <div class="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <label class="text-xs font-bold text-stone-600 whitespace-nowrap">選擇年度檔案：</label>
                    <select id="expense-year-select" onchange="switchExpenseYear(this.value)" class="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-bold text-stone-800 focus:outline-none focus:border-[#C59B63]">
                        <option value="2027" ${currentExpenseYear == 2027 ? 'selected' : ''}>2027 年度檔案</option>
                        <option value="2026" ${currentExpenseYear == 2026 ? 'selected' : ''}>2026 年度檔案</option>
                        <option value="2025" ${currentExpenseYear == 2025 ? 'selected' : ''}>2025 年度檔案</option>
                    </select>
                </div>
            </div>

            <!-- 2. 主要填寫與明細列表 -->
            <div class="card-frame p-4 sm:p-5 space-y-5">
                <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-stone-100 pb-3">
                    <div class="flex items-center space-x-2">
                        <span class="px-2.5 py-1 bg-[#C59B63] text-white rounded-lg text-xs font-bold whitespace-nowrap">${currentExpenseMember}</span>
                        <h3 class="text-xs sm:text-sm font-bold text-stone-800">支出填寫與紀錄列表 (${currentExpenseYear} 年)</h3>
                    </div>

                    <!-- 人員頁籤切換按鈕 -->
                    <div class="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                        <div class="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl w-max">
                            ${EXPENSE_MEMBERS.map(m => `
                                <button onclick="switchExpenseMember('${m}')" class="px-3 py-1 text-xs font-bold rounded-lg transition whitespace-nowrap ${currentExpenseMember === m ? 'bg-white text-stone-800 shadow-2xs' : 'text-stone-500 hover:text-stone-800'}">
                                    ${m}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- 新增支出輸入框 -->
                <form onsubmit="addExpenseItem(event)" class="bg-stone-50 p-3.5 sm:p-4 rounded-2xl border border-stone-200 space-y-3">
                    <div class="font-bold text-xs text-stone-700">＋ 新增 ${currentExpenseMember} 支出紀錄</div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
                        
                        <!-- 1. 日期欄位 -->
                        <div class="w-full min-w-0 md:col-span-1">
                            <label class="block text-[11px] font-bold text-stone-600 mb-1">日期</label>
                            <input type="date" id="exp-input-date" required class="w-full max-w-full box-border px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono focus:outline-none focus:border-[#C59B63] appearance-none block">
                        </div>

                        <!-- 2. 項目分類欄位 -->
                        <div class="w-full min-w-0 md:col-span-1">
                            <label class="block text-[11px] font-bold text-stone-600 mb-1">項目分類</label>
                            <select id="exp-input-category" required class="w-full max-w-full box-border px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#C59B63] block">
                                ${EXPENSE_CATEGORIES.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                            </select>
                        </div>

                        <!-- 3. 金額欄位 -->
                        <div class="w-full min-w-0 md:col-span-1">
                            <label class="block text-[11px] font-bold text-stone-600 mb-1">金額 (NT$)</label>
                            <input type="number" id="exp-input-amount" min="1" placeholder="例如: 1500" required class="w-full max-w-full box-border px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#C59B63] block">
                        </div>

                        <!-- 4. 秘書備註說明與按鈕 -->
                        <div class="w-full min-w-0 md:col-span-2">
                            <label class="block text-[11px] font-bold text-stone-600 mb-1">秘書備註說明</label>
                            <div class="flex items-center space-x-2">
                                <input type="text" id="exp-input-note" placeholder="例：是否有發票..." class="flex-1 min-w-0 box-border px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-[#C59B63]">
                                <button type="submit" class="px-4 py-2 btn-gold hover:opacity-90 rounded-xl text-xs font-bold transition shadow-2xs whitespace-nowrap cursor-pointer shrink-0">
                                    <i class="fa-solid fa-plus mr-1"></i>新增
                                </button>
                            </div>
                        </div>

                    </div>
                </form>

                <!-- 明細表格區域 (表格獨立橫向滑動) -->
                <div id="expense-table-wrapper" class="w-full overflow-x-auto border border-stone-200/80 rounded-xl">
                    <table class="w-full text-left text-xs border-collapse min-w-[520px]">
                        <thead>
                            <tr class="bg-stone-100/90 text-stone-600 border-b border-stone-200">
                                <th class="p-3 font-bold w-12 text-center whitespace-nowrap">對帳</th>
                                <th class="p-3 font-bold w-28 whitespace-nowrap">日期</th>
                                <th class="p-3 font-bold w-32 whitespace-nowrap">項目分類</th>
                                <th class="p-3 font-bold w-28 whitespace-nowrap">金額</th>
                                <th class="p-3 font-bold whitespace-nowrap">備註</th>
                                <th class="p-3 font-bold w-14 text-center whitespace-nowrap">操作</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-stone-100 text-stone-700 bg-white">
                            ${(data[currentExpenseMember] || []).length === 0 ? `
                                <tr>
                                    <td colspan="6" class="p-8 text-center text-stone-400">目前 ${currentExpenseMember} 在 ${currentExpenseYear} 年無支出紀錄</td>
                                </tr>
                            ` : (data[currentExpenseMember] || []).map((item, idx) => `
                                <tr class="hover:bg-stone-50 transition ${item.checked ? 'bg-amber-50/40' : ''}">
                                    <td class="p-3 text-center whitespace-nowrap">
                                        <input type="checkbox" onchange="toggleExpenseCheck(${idx})" ${item.checked ? 'checked' : ''} class="w-4 h-4 rounded border-stone-300 text-[#C59B63] focus:ring-[#C59B63] cursor-pointer">
                                    </td>
                                    <td class="p-3 font-mono whitespace-nowrap ${item.checked ? 'line-through text-stone-400' : ''}">${item.date}</td>
                                    <td class="p-3 whitespace-nowrap"><span class="px-2.5 py-1 bg-stone-100 text-stone-800 rounded-md font-bold border border-stone-200 inline-block">${item.category}</span></td>
                                    <td class="p-3 font-mono font-bold text-emerald-700 whitespace-nowrap">NT$ ${Number(item.amount).toLocaleString()}</td>
                                    <td class="p-3 text-stone-600 min-w-[120px]">${item.note || '-'}</td>
                                    <td class="p-3 text-center whitespace-nowrap">
                                        <button onclick="deleteExpenseItem(${idx})" class="text-stone-400 hover:text-rose-600 p-1 cursor-pointer transition" title="刪除">
                                            <i class="fa-solid fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 3. 當年度個人零用金總額統計 -->
            <div>
                <div class="flex items-center space-x-2 mb-3 px-1">
                    <i class="fa-solid fa-chart-pie text-[#C59B63] text-sm"></i>
                    <h3 class="text-xs font-bold uppercase tracking-wider text-stone-500">${currentExpenseYear} 年度個人零用金總額統計</h3>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    ${EXPENSE_MEMBERS.map(m => `
                        <div onclick="switchExpenseMember('${m}')" class="p-3.5 rounded-2xl border transition cursor-pointer ${currentExpenseMember === m ? 'bg-amber-50/80 border-[#C59B63] shadow-xs' : 'bg-white border-stone-200 hover:border-stone-300'}">
                            <div class="flex items-center justify-between text-xs text-stone-500 mb-1">
                                <span class="font-bold ${currentExpenseMember === m ? 'text-[#B38952]' : 'text-stone-700'}">${m}</span>
                                <i class="fa-solid fa-user text-[10px]"></i>
                            </div>
                            <div class="text-sm sm:text-base font-bold font-mono text-stone-800">
                                NT$ ${memberTotals[m].toLocaleString()}
                            </div>
                        </div>
                    `).join('')}

                    <!-- 總體零用金 -->
                    <div class="p-3.5 rounded-2xl border bg-stone-900 text-white border-stone-800 shadow-xs">
                        <div class="flex items-center justify-between text-xs text-stone-400 mb-1">
                            <span class="font-bold">全體總支出</span>
                            <i class="fa-solid fa-wallet text-[10px] text-amber-400"></i>
                        </div>
                        <div class="text-sm sm:text-base font-bold font-mono text-amber-400">
                            NT$ ${grandTotal.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 4. 全體項目比例與金額分析看板 -->
            <div class="card-frame p-4 sm:p-5 space-y-4">
                <div class="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div class="flex items-center space-x-2">
                        <i class="fa-solid fa-chart-bar text-sky-600"></i>
                        <h3 class="text-xs sm:text-sm font-bold text-stone-800">${currentExpenseYear} 年度全體支出項目與金額佔比分析</h3>
                    </div>
                    <span class="text-[11px] text-stone-400 font-mono whitespace-nowrap">總筆數：${totalItemsCount} 筆</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${Object.keys(categoryStats).length === 0 ? `
                        <div class="col-span-2 text-center py-6 text-stone-400 text-xs">當年度尚無支出紀錄可供分析</div>
                    ` : Object.entries(categoryStats).map(([cat, stat]) => {
                        const countPct = totalItemsCount > 0 ? ((stat.count / totalItemsCount) * 100).toFixed(1) : 0;
                        const amtPct = grandTotal > 0 ? ((stat.amount / grandTotal) * 100).toFixed(1) : 0;
                        return `
                            <div class="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
                                <div class="flex justify-between items-center text-xs">
                                    <span class="font-bold text-stone-800">${cat}</span>
                                    <span class="font-mono text-emerald-700 font-bold">NT$ ${stat.amount.toLocaleString()} (${amtPct}%)</span>
                                </div>
                                <!-- 進度條 -->
                                <div class="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                                    <div class="bg-[#C59B63] h-full rounded-full transition-all duration-500" style="width: ${amtPct}%"></div>
                                </div>
                                <div class="flex justify-between text-[10px] text-stone-400">
                                    <span>項目筆數：${stat.count} 筆</span>
                                    <span>筆數佔比：${countPct}%</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

        </div>
    `;

    // 預設將當前日期帶入輸入框
    const dateInput = document.getElementById('exp-input-date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
}

// 切換年度
function switchExpenseYear(year) {
    currentExpenseYear = year;
    renderExpensesModule();
}

// 切換成員
function switchExpenseMember(member) {
    currentExpenseMember = member;
    renderExpensesModule();
}

// 新增單筆支出
function addExpenseItem(event) {
    event.preventDefault();

    const date = document.getElementById('exp-input-date').value;
    const category = document.getElementById('exp-input-category').value;
    const amount = Number(document.getElementById('exp-input-amount').value);
    const note = document.getElementById('exp-input-note').value;

    if (!date || !amount) return;

    const data = getExpenseData(currentExpenseYear);
    if (!data[currentExpenseMember]) {
        data[currentExpenseMember] = [];
    }

    data[currentExpenseMember].unshift({
        id: Date.now(),
        date,
        category,
        amount,
        note,
        checked: false
    });

    saveExpenseData(currentExpenseYear, data);
    renderExpensesModule();
}

// 切換核取對帳狀態
function toggleExpenseCheck(index) {
    const data = getExpenseData(currentExpenseYear);
    if (data[currentExpenseMember] && data[currentExpenseMember][index]) {
        data[currentExpenseMember][index].checked = !data[currentExpenseMember][index].checked;
        saveExpenseData(currentExpenseYear, data);
        renderExpensesModule();
    }
}

// 刪除單筆支出
function deleteExpenseItem(index) {
    if (!confirm('確定要刪除此筆支出紀錄嗎？')) return;

    const data = getExpenseData(currentExpenseYear);
    if (data[currentExpenseMember]) {
        data[currentExpenseMember].splice(index, 1);
        saveExpenseData(currentExpenseYear, data);
        renderExpensesModule();
    }
}

// 掛載至全域 window
window.renderExpensesModule = renderExpensesModule;
window.switchExpenseYear = switchExpenseYear;
window.switchExpenseMember = switchExpenseMember;
window.addExpenseItem = addExpenseItem;
window.toggleExpenseCheck = toggleExpenseCheck;
window.deleteExpenseItem = deleteExpenseItem;
