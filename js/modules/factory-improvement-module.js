// 全域變數用來儲存原始資料與篩選後資料
window.factoryRawData = [];

function renderFactoryImprovementModule() {
    const container = document.getElementById('app-container');
    if (!container) return;

    container.innerHTML = `
        <div class="max-w-7xl mx-auto space-y-6 pb-12">
            <!-- 頂部頁面標題與返回按鈕 -->
            <div class="flex items-center justify-between border-b border-stone-200 pb-4">
                <div class="flex items-center space-x-3">
                    <button onclick="if(typeof renderToolsModule==='function') renderToolsModule()" class="p-2 hover:bg-stone-100 text-stone-600 rounded-xl transition cursor-pointer">
                        <i class="fa-solid fa-arrow-left text-base"></i>
                    </button>
                    <div>
                        <h2 class="text-base font-bold text-stone-900">工廠改善計畫查詢</h2>
                        <p class="text-xs text-stone-500 mt-0.5">匯入 Excel 檔案並進行跨欄位智慧關鍵字搜尋</p>
                    </div>
                </div>
            </div>

            <!-- 操作控制區：上傳與關鍵字搜尋 -->
            <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
                <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
                    
                    <!-- 1. Excel 上傳按鈕 -->
                    <div class="w-full md:w-auto shrink-0">
                        <label class="cursor-pointer inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition shadow-2xs w-full md:w-auto">
                            <i class="fa-solid fa-file-excel text-sm"></i>
                            <span>匯入 Excel 改善計畫表</span>
                            <input type="file" id="factoryExcelInput" accept=".xlsx, .xls" class="hidden" onchange="handleFactoryExcelUpload(event)">
                        </label>
                    </div>

                    <!-- 2. 關鍵字搜尋框 -->
                    <div class="relative w-full md:w-96">
                        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
                        <input type="text" id="factorySearchInput" oninput="filterFactoryData()" placeholder="請輸入縣市、工廠名稱或廠址關鍵字..." class="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition">
                    </div>
                </div>
            </div>

            <!-- 資料表格區 -->
            <div class="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                                <th class="py-3.5 px-5 w-24">縣市</th>
                                <th class="py-3.5 px-5 w-64">工廠名稱</th>
                                <th class="py-3.5 px-5">廠址</th>
                            </tr>
                        </thead>
                        <tbody id="factoryTableBody" class="divide-y divide-stone-100 text-xs text-stone-700">
                            <tr>
                                <td colspan="3" class="py-12 text-center text-stone-400">
                                    <i class="fa-solid fa-file-circle-plus text-3xl mb-2 text-stone-300"></i>
                                    <p>請點擊上方按鈕匯入 Excel 檔案</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- 底部統計筆數 -->
                <div class="px-5 py-3 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                    <span>總共查詢到 <strong id="factoryResultCount" class="text-stone-700">0</strong> 筆資料</span>
                </div>
            </div>
        </div>
    `;
}

// 處理 Excel 檔案解析
function handleFactoryExcelUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (typeof XLSX === 'undefined') {
        alert('尚未載入 XLSX 解析庫，請確認 HTML 頁面已載入 sheetjs！');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // 轉為 JSON 格式
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
            
            // 格式化資料，自動對應欄位名稱（支援常見的 Excel 表頭命名）
            window.factoryRawData = jsonData.map(item => ({
                city: item['縣市'] || item['縣市別'] || item['City'] || '未填寫',
                name: item['工廠名稱'] || item['廠名'] || item['FactoryName'] || '未填寫',
                address: item['廠址'] || item['地址'] || item['工廠地址'] || item['Address'] || '未填寫'
            }));

            // 渲染資料
            renderFactoryTable(window.factoryRawData);
            
            // 重置搜尋框
            document.getElementById('factorySearchInput').value = '';
        } catch (error) {
            console.error('Excel 解析失敗:', error);
            alert('Excel 解析失敗，請確認檔案格式是否正確。');
        }
    };
    reader.readAsArrayBuffer(file);
}

// 關鍵字即時過濾
function filterFactoryData() {
    const keyword = document.getElementById('factorySearchInput').value.trim().toLowerCase();
    
    if (!keyword) {
        renderFactoryTable(window.factoryRawData);
        return;
    }

    const filtered = window.factoryRawData.filter(item => {
        return item.city.toLowerCase().includes(keyword) ||
               item.name.toLowerCase().includes(keyword) ||
               item.address.toLowerCase().includes(keyword);
    });

    renderFactoryTable(filtered);
}

// 繪製表格內容
function renderFactoryTable(data) {
    const tbody = document.getElementById('factoryTableBody');
    const countEl = document.getElementById('factoryResultCount');
    
    if (!tbody) return;

    countEl.innerText = data.length;

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="py-12 text-center text-stone-400">
                    <i class="fa-solid fa-magnifying-glass text-2xl mb-2 text-stone-300"></i>
                    <p>未找到符合關鍵字的資料</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = data.map(item => `
        <tr class="hover:bg-stone-50/80 transition">
            <td class="py-3 px-5 font-bold text-stone-900 whitespace-nowrap">${item.city}</td>
            <td class="py-3 px-5 font-medium text-stone-800">${item.name}</td>
            <td class="py-3 px-5 text-stone-600">${item.address}</td>
        </tr>
    `).join('');
}

// 掛載至全域 window
window.renderFactoryImprovementModule = renderFactoryImprovementModule;
window.handleFactoryExcelUpload = handleFactoryExcelUpload;
window.filterFactoryData = filterFactoryData;
