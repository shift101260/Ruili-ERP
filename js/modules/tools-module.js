// js/modules/tools-module.js

function renderToolsModule() {
    console.log("正在渲染工具專區...");
    
    const container = document.getElementById('app-container');
    if (!container) {
        console.error("找不到 #app-container 容器！請檢查 index.html 中的 <main id=\"app-container\">");
        return;
    }

    container.innerHTML = `
        <div class="space-y-8 max-w-7xl mx-auto pb-12">
            
            <!-- 區塊一：專業評估與試算工具 -->
            <div class="space-y-3">
                <div class="flex items-center space-x-2 px-1">
                    <i class="fa-solid fa-calculator text-[#C59B63] text-sm"></i>
                    <h3 class="text-xs font-bold uppercase tracking-wider text-stone-500">專業評估與試算工具</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <!-- 1. 土地基本資料 Modal -->
                    <div onclick="openLandModal()" class="p-4 bg-white hover:bg-amber-50/50 border border-stone-200 hover:border-amber-300 rounded-2xl transition flex items-center space-x-3.5 shadow-2xs group cursor-pointer">
                        <div class="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition">
                            <i class="fa-solid fa-map"></i>
                        </div>
                        <div class="overflow-hidden flex-1">
                            <div class="font-bold text-xs text-stone-900 truncate">土地基本資料</div>
                            <div class="text-[10px] text-stone-400 truncate mt-0.5">多地號面積與持分試算</div>
                        </div>
                        <i class="fa-solid fa-arrow-right text-xs text-stone-300 group-hover:text-amber-600"></i>
                    </div>

                    <!-- 2. 保存登記建物 Modal -->
                    <div onclick="openRegisteredBuildingModal()" class="p-4 bg-white hover:bg-sky-50/50 border border-stone-200 hover:border-sky-300 rounded-2xl transition flex items-center space-x-3.5 shadow-2xs group cursor-pointer">
                        <div class="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition">
                            <i class="fa-solid fa-building"></i>
                        </div>
                        <div class="overflow-hidden flex-1">
                            <div class="font-bold text-xs text-stone-900 truncate">保存登記建物</div>
                            <div class="text-[10px] text-stone-400 truncate mt-0.5">建號試算與持分坪數</div>
                        </div>
                        <i class="fa-solid fa-arrow-right text-xs text-stone-300 group-hover:text-sky-600"></i>
                    </div>

                    <!-- 3. 未保存登記建物 Modal -->
                    <div onclick="openUnregisteredBuildingModal()" class="p-4 bg-white hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-300 rounded-2xl transition flex items-center space-x-3.5 shadow-2xs group cursor-pointer">
                        <div class="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition">
                            <i class="fa-solid fa-house-chimney"></i>
                        </div>
                        <div class="overflow-hidden flex-1">
                            <div class="font-bold text-xs text-stone-900 truncate">未保存登記建物</div>
                            <div class="text-[10px] text-stone-400 truncate mt-0.5">增補建廠房面積評估</div>
                        </div>
                        <i class="fa-solid fa-arrow-right text-xs text-stone-300 group-hover:text-emerald-600"></i>
                    </div>

                    <!-- 4. 太陽能試算 Modal -->
                    <div onclick="openSolarModal()" class="p-4 bg-white hover:bg-amber-50/50 border border-stone-200 hover:border-amber-400 rounded-2xl transition flex items-center space-x-3.5 shadow-2xs group cursor-pointer">
                        <div class="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition">
                            <i class="fa-solid fa-solar-panel"></i>
                        </div>
                        <div class="overflow-hidden flex-1">
                            <div class="font-bold text-xs text-stone-900 truncate">太陽能試算</div>
                            <div class="text-[10px] text-stone-400 truncate mt-0.5">屋頂坪數與發電效益精算</div>
                        </div>
                        <i class="fa-solid fa-arrow-right text-xs text-stone-300 group-hover:text-amber-600"></i>
                    </div>

                    <!-- 5. 土地變更評估 Modal -->
                    <div onclick="openLandChangeModal()" class="p-4 bg-white hover:bg-indigo-50/50 border border-stone-200 hover:border-indigo-300 rounded-2xl transition flex items-center space-x-3.5 shadow-2xs group cursor-pointer">
                        <div class="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition">
                            <i class="fa-solid fa-earth-asia"></i>
                        </div>
                        <div class="overflow-hidden flex-1">
                            <div class="font-bold text-xs text-stone-900 truncate">土地變更評估</div>
                            <div class="text-[10px] text-stone-400 truncate mt-0.5">回饋金與都內代金計算</div>
                        </div>
                        <i class="fa-solid fa-arrow-right text-xs text-stone-300 group-hover:text-indigo-600"></i>
                    </div>
                </div>
            </div>

            <!-- 區塊二：基本資料查詢與外部資源 -->
            <div class="space-y-3">
                <div class="flex items-center space-x-2 px-1">
                    <i class="fa-solid fa-map-location-dot text-emerald-500 text-sm"></i>
                    <h3 class="text-xs font-bold uppercase tracking-wider text-stone-500">基本資料查詢與圖資</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <!-- 工廠改善計畫查詢 -->
                    <div onclick="if(typeof renderFactoryImprovementModule==='function') renderFactoryImprovementModule()" class="p-4 bg-white hover:bg-amber-50/50 border border-stone-200 hover:border-amber-300 rounded-2xl transition flex items-center space-x-3.5 shadow-2xs group cursor-pointer">
                        <div class="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition">
                            <i class="fa-solid fa-file-pdf"></i>
                        </div>
                        <div class="overflow-hidden flex-1">
                            <div class="font-bold text-xs text-stone-900 truncate">工廠改善計畫查詢</div>
                            <div class="text-[10px] text-stone-400 truncate mt-0.5">PDF 名單與智慧篩選</div>
                        </div>
                        <i class="fa-solid fa-arrow-right text-xs text-stone-300 group-hover:text-amber-600"></i>
                    </div>

                    <!-- 國土測繪圖資服務雲 -->
                    <a href="https://maps.nlsc.gov.tw/T09/mobilemap.action" target="_blank" rel="noopener noreferrer" class="p-4 bg-white hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-300 rounded-2xl transition flex items-center space-x-3.5 shadow-2xs group">
                        <div class="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition">
                            <i class="fa-solid fa-map"></i>
                        </div>
                        <div class="overflow-hidden flex-1">
                            <div class="font-bold text-xs text-stone-900 truncate">測繪雲</div>
                            <div class="text-[10px] text-stone-400 truncate mt-0.5">地籍圖定位與實地查勘</div>
                        </div>
                        <i class="fa-solid fa-arrow-up-right-from-square text-xs text-stone-300 group-hover:text-emerald-600"></i>
                    </a>
                </div>
            </div>

        </div>
    `;
}

// 掛載至全域 window
window.renderToolsModule = renderToolsModule;
