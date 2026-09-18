// 全域變數用來儲存原始資料
window.factoryRawData = [];

function renderFactoryImprovementModule() {
    const container = document.getElementById('app-container');
    if (!container) return;

    // 強制移除父層任何限制寬度的 class，改為滿版
    container.className = "w-full min-h-screen px-2 sm:px-4 lg:px-6";
    if (container.parentElement) {
        container.parentElement.style.maxWidth = "none";
        container.parentElement.style.width = "100%";
    }

    container.innerHTML = `
        <div class="w-full space-y-6 pb-12">
            <!-- 頂部頁面標題與返回按鈕 -->
            <div class="flex items-center justify-between border-b border-stone-200 pb-4">
                <div class="flex items-center space-x-3">
                    <button type="button" onclick="if(typeof renderToolsModule==='function') renderToolsModule()" class="p-2.5 hover:bg-stone-100 text-stone-600 rounded-xl transition cursor-pointer">
                        <i class="fa-solid fa-arrow-left text-lg"></i>
                    </button>
                    <div>
                        <h2 class="text-lg font-bold text-stone-900">工廠改善計畫查詢</h2>
                        <p class="text-xs text-stone-500 mt-0.5">匯入表格檔案進行跨欄位智慧關鍵字搜尋</p>
                    </div>
                </div>
            </div>

            <!-- 操作控制區：上傳與關鍵字搜尋 -->
            <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4 w-full">
                <div class="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
                    
                    <!-- 1. 表格上傳按鈕 (不限格式，讓 Mac 可以任意點選所有檔案) -->
                    <div class="w-full md:w-auto shrink-0">
                        <label class="cursor-pointer inline-flex items-center justify-center space-x-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-sm w-full md:w-auto">
                            <i class="fa-solid fa-file-excel text-sm"></i>
                            <span>匯入 Excel / ODS 改善計畫表</span>
                            <input type="file" id="factoryExcelInput" class="hidden" onchange="handleFactoryExcelUpload(event)">
                        </label>
                    </div>

                    <!-- 2. 關鍵字搜尋框 -->
                    <div class="relative w-full md:w-1/2">
                        <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm"></i>
                        <input type="text" id="factorySearchInput" oninput="filterFactoryData()" placeholder="請輸入縣市、工廠名稱或廠址關鍵字搜尋..." class="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition">
                    </div>
                </div>
            </div>

            <!-- 資料表格區 (滿版設計，支援拖曳上傳) -->
            <div id="factoryDropZone" 
                 ondragover="handleFactoryDragOver(event)" 
                 ondragleave="handleFactoryDragLeave(event)" 
                 ondrop="handleFactoryDrop(event)"
                 class="w-full bg-white rounded-2xl border-2 border-dashed border-stone-200 shadow-2xs overflow-hidden transition-colors duration-200">
                <div class="overflow-x-auto w-full">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-stone-50/80 border-b border-stone-200 text-xs font-bold text-stone-500 uppercase tracking-wider">
                                <th class="py-4 px-6 w-32 whitespace-nowrap">縣市</th>
                                <th class="py-4 px-6 w-1/3">工廠名稱</th>
                                <th class="py-4 px-6">廠址</th>
                            </tr>
                        </thead>
                        <tbody id="factoryTableBody" class="divide-y divide-stone-100 text-xs text-stone-700">
                            <tr>
                                <td colspan="3" class="py-20 text-center text-stone-400">
                                    <i class="fa-solid fa-file-circle-plus text-4xl mb-3 text-stone-300"></i>
                                    <p class="text-sm font-medium">請點擊上方按鈕選取檔案，或將 Excel / ODS 檔案拖曳至此區域</p>
                                    <p class="text-xs text-stone-400 mt-1">支援 .ods / .xlsx / .xls / .csv 格式</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- 底部統計筆數 -->
                <div class="px-6 py-3.5 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span>總共查詢到 <strong id="factoryResultCount" class="text-stone-900 font-bold">0</strong> 筆資料</span>
                </div>
            </div>
        </div>
    `;
}

// 處理拖曳視覺效果
function handleFactoryDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    const zone = document.getElementById('factoryDropZone');
    if (zone) zone.classList.add('border-amber-500', 'bg-amber-50/20');
}

function handleFactoryDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    const zone = document.getElementById('factoryDropZone');
    if (zone) zone.classList.remove('border-amber-500', 'bg-amber-50/20');
}

function handleFactoryDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    const zone = document.getElementById('factoryDropZone');
    if (zone) zone.classList.remove('border-amber-500', 'bg-amber-50/20');

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
        processExcelFile(files[0]);
    }
}

function handleFactoryExcelUpload(event) {
    const file = event.target.files[0];
    if (file) {
        processExcelFile(file);
    }
}

// 解析表格的核心邏輯 (相容 ODS / XLSX / CSV)
function processExcelFile(file) {
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
            
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
            
            if (jsonData.length === 0) {
                alert('上傳的表格內容為空！');
                return;
            }

            // 彈性欄位比對（包含常見的各種寫法）
            window.factoryRawData = jsonData.map(item => ({
                city: item['縣市'] || item['縣市別'] || item['City'] || item['縣/市'] || '未填寫',
                name: item['工廠名稱'] || item['廠名'] || item['FactoryName'] || item['事業名稱'] || '未填寫',
                address: item['廠址'] || item['地址'] || item['工廠地址'] || item['Address'] || '未填寫'
            }));

            renderFactoryTable(window.factoryRawData);
            
            const searchInput = document.getElementById('factorySearchInput');
            if (searchInput) searchInput.value = '';
        } catch (error) {
            console.error('檔案解析失敗:', error);
            alert('表格解析失敗，請確認檔案內容格式是否正確。');
        }
    };
    reader.readAsArrayBuffer(file);
}

// 關鍵字搜尋
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

// 渲染表格
function renderFactoryTable(data) {
    const tbody = document.getElementById('factoryTableBody');
    const countEl = document.getElementById('factoryResultCount');
    
    if (!tbody) return;

    countEl.innerText = data.length;

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="py-20 text-center text-stone-400">
                    <i class="fa-solid fa-magnifying-glass text-3xl mb-3 text-stone-300"></i>
                    <p class="text-sm font-medium">未找到符合關鍵字的資料</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = data.map(item => `
        <tr class="hover:bg-amber-50/30 transition">
            <td class="py-3.5 px-6 font-bold text-stone-900 whitespace-nowrap">${item.city}</td>
            <td class="py-3.5 px-6 font-medium text-stone-800">${item.name}</td>
            <td class="py-3.5 px-6 text-stone-600">${item.address}</td>
        </tr>
    `).join('');
}

// 掛載全域
window.renderFactoryImprovementModule = renderFactoryImprovementModule;
window.handleFactoryExcelUpload = handleFactoryExcelUpload;
window.handleFactoryDragOver = handleFactoryDragOver;
window.handleFactoryDragLeave = handleFactoryDragLeave;
window.handleFactoryDrop = handleFactoryDrop;
window.filterFactoryData = filterFactoryData;
