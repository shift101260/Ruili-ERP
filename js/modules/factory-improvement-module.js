// 全域變數用來儲存原始資料
window.factoryRawData = [];

function renderFactoryImprovementModule() {
    const container = document.getElementById('app-container');
    if (!container) return;

    // 強制讓外層容器滿版呈現
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
                    
                    <!-- 1. 表格上傳按鈕 (系統金色) -->
                    <div class="w-full md:w-auto shrink-0">
                        <label class="cursor-pointer inline-flex items-center justify-center space-x-2 px-5 py-3 bg-[#c8a362] hover:bg-[#b59152] text-white rounded-xl text-xs font-bold transition shadow-sm w-full md:w-auto">
                            <i class="fa-solid fa-file-excel text-sm"></i>
                            <span>匯入 Excel / ODS 改善計畫表</span>
                            <input type="file" id="factoryExcelInput" class="hidden" onchange="handleFactoryExcelUpload(event)">
                        </label>
                    </div>

                    <!-- 2. 關鍵字搜尋框 -->
                    <div class="relative w-full md:w-1/2">
                        <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm"></i>
                        <input type="text" id="factorySearchInput" oninput="filterFactoryData()" placeholder="請輸入編號、縣市、工廠名稱或廠址關鍵字搜尋..." class="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#c8a362] focus:bg-white transition">
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
                                <th class="py-4 px-6 w-24 whitespace-nowrap">編號</th>
                                <th class="py-4 px-6 w-32 whitespace-nowrap">縣市</th>
                                <th class="py-4 px-6 w-1/3">工廠名稱</th>
                                <th class="py-4 px-6">廠址</th>
                            </tr>
                        </thead>
                        <tbody id="factoryTableBody" class="divide-y divide-stone-100 text-xs text-stone-700">
                            <tr>
                                <td colspan="4" class="py-20 text-center text-stone-400">
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

// 拖曳視覺處理
function handleFactoryDragOver(e) { e.preventDefault(); e.stopPropagation(); document.getElementById('factoryDropZone')?.classList.add('border-[#c8a362]', 'bg-amber-50/20'); }
function handleFactoryDragLeave(e) { e.preventDefault(); e.stopPropagation(); document.getElementById('factoryDropZone')?.classList.remove('border-[#c8a362]', 'bg-amber-50/20'); }
function handleFactoryDrop(e) {
    e.preventDefault(); e.stopPropagation();
    document.getElementById('factoryDropZone')?.classList.remove('border-[#c8a362]', 'bg-amber-50/20');
    if (e.dataTransfer.files?.length > 0) processExcelFile(e.dataTransfer.files[0]);
}

function handleFactoryExcelUpload(e) {
    if (e.target.files?.[0]) processExcelFile(e.target.files[0]);
}

// ODS 格式精準解析演算法 (對應 A欄=編號, B欄=縣市, C欄=工廠名稱, D欄=廠址)
function processExcelFile(file) {
    if (typeof XLSX === 'undefined') {
        alert('尚未載入 XLSX 解析庫，請確認 HTML 已載入 SheetJS！');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            let targetRows = null;

            // 自動找到包含資料的 Sheet
            for (let name of workbook.SheetNames) {
                const sheet = workbook.Sheets[name];
                const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
                if (rows && rows.length > 1) {
                    targetRows = rows;
                    break;
                }
            }

            if (!targetRows || targetRows.length === 0) {
                alert('表格檔案內無有效資料！');
                return;
            }

            let parsedData = [];

            for (let i = 0; i < targetRows.length; i++) {
                const row = targetRows[i];
                if (!row || row.length < 3) continue;

                // 轉為字串
                const col0 = String(row[0] || '').trim(); // A欄：編號 / 大標題
                const col1 = String(row[1] || '').trim(); // B欄：縣市
                const col2 = String(row[2] || '').trim(); // C欄：工廠名稱
                const col3 = String(row[3] || '').trim(); // D欄：廠址

                // 忽略頂部宣告標題與標頭列
                if (col0.includes('名單') || col0.includes('列表日期') || col0 === '編號' || col1 === '縣市') {
                    continue;
                }

                // 讀取 A欄(編號), B欄(縣市), C欄(工廠名稱), D欄(廠址)
                if (col1 && col2) {
                    parsedData.push({
                        id: col0 || (parsedData.length + 1),
                        city: col1,
                        name: col2,
                        address: col3 || '未填寫'
                    });
                }
            }

            window.factoryRawData = parsedData;
            renderFactoryTable(window.factoryRawData);

            const searchInput = document.getElementById('factorySearchInput');
            if (searchInput) searchInput.value = '';

        } catch (error) {
            console.error('檔案解析失敗:', error);
            alert('表格解析失敗，請確認檔案格式！');
        }
    };
    reader.readAsArrayBuffer(file);
}

// 關鍵字即時搜尋 (包含編號)
function filterFactoryData() {
    const keyword = document.getElementById('factorySearchInput').value.trim().toLowerCase();
    
    if (!keyword) {
        renderFactoryTable(window.factoryRawData);
        return;
    }

    const filtered = window.factoryRawData.filter(item => {
        return String(item.id).toLowerCase().includes(keyword) ||
               item.city.toLowerCase().includes(keyword) ||
               item.name.toLowerCase().includes(keyword) ||
               item.address.toLowerCase().includes(keyword);
    });

    renderFactoryTable(filtered);
}

// 繪製表格內容 (4 欄精準對齊)
function renderFactoryTable(data) {
    const tbody = document.getElementById('factoryTableBody');
    const countEl = document.getElementById('factoryResultCount');
    
    if (!tbody) return;

    countEl.innerText = data.length;

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="py-20 text-center text-stone-400">
                    <i class="fa-solid fa-magnifying-glass text-3xl mb-3 text-stone-300"></i>
                    <p class="text-sm font-medium">未找到符合關鍵字的資料</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = data.map(item => `
        <tr class="hover:bg-amber-50/30 transition">
            <td class="py-3.5 px-6 font-bold text-stone-400 whitespace-nowrap">${item.id}</td>
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
