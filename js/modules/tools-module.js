// ========================================== 
// 睿立集團 ERP - 工具專區完整版 (tools-module.js) 
// ========================================== 

function renderToolsModule() { 
    const container = document.getElementById('app-container'); 
    if (!container) return; 

    container.innerHTML = ` 
        <div class="space-y-8 max-w-7xl mx-auto pb-12"> 
            
            <!-- 區塊一：基本資料查詢 (含商業司、工廠登記、謄本調閱) --> 
            <div class="space-y-3"> 
                <div class="flex items-center space-x-2 px-1"> 
                    <i class="fa-solid fa-map-location-dot text-emerald-500 text-sm"></i> 
                    <h3 class="text-xs font-bold uppercase tracking-wider text-stone-500">基本資料查詢</h3> 
                </div> 
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4"> 
                    <!-- 工廠改善計畫查詢 --> 
                    <div onclick="if(typeof renderFactoryImprovementModule === 'function') renderFactoryImprovementModule()" class="p-4 bg-white hover:bg-amber-50/50 border border-stone-200 hover:border-amber-300 rounded-2xl transition flex items-center space-x-3.5 shadow-2xs group cursor-pointer"> 
                        <div class="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition"> 
                            <i class="fa-solid fa-file-pdf"></i> 
                        </div> 
                        <div class="overflow-hidden flex-1"> 
                            <div class="font-bold text-xs text-stone-900 truncate">工廠改善計畫查詢</div> 
                            <div class="text-[10px] text-stone-400 truncate mt-0.5">PDF 名單與智慧篩選管理</div> 
                        </div> 
                        <i class="fa-solid fa-arrow-right text-xs text-stone-300 group-hover:text-amber-600"></i> 
                    </div> 

                    <!-- 測繪雲 --> 
                    <a href="https://maps.nlsc.gov.tw/T09/mobilemap.action" target="_blank" rel="noopener noreferrer" class="p-4 bg-white hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-300 rounded-2xl transition flex items-center space-x-3.5 shadow-2xs group"> 
                        <div class="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition"> 
                            <i class="fa-solid fa-map"></i> 
                        </div> 
                        <div class="overflow-hidden flex-1"> 
                            <div class="font-bold text-xs text-stone-900 truncate">測繪雲</div> 
                            <div class="text-[10px] text-stone-400 truncate mt-0.5">地籍圖快速定位與實地查勘</div> 
                        </div> 
                        <i class="fa-solid fa-arrow-up-right-from-square text-xs text-stone-300 group-hover:text-emerald-600"></i> 
                    </a> 

                    <!-- 商業司 --> 
                    <a href="https://findbiz.nat.gov.tw/fts/query/QueryList/queryList.do" target="_blank" rel="noopener noreferrer" class="p-4 bg-white hover:bg-sky-50/50 border border-stone-200 hover:border-sky-300 rounded-2xl transition flex items-center space-x-3.5 shadow-2xs group"> 
                        <div class="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition"> 
                            <i class="fa-solid fa-building"></i> 
                        </div> 
                        <div class="overflow-hidden flex-1"> 
                            <div class="font-bold text-xs text-stone-900 truncate">商業司</div> 
                            <div class="text-[10px] text-stone-400 truncate mt-0.5">企業背景資訊查詢</div> 
                        </div> 
                        <i class="fa-solid fa-arrow-up-right-from-square text-xs text-stone-300 group-hover:text-sky-600"></i> 
                    </a> 

                    <!-- 工廠登記查詢 --> 
                    <a href="https://serv.gcis.nat.gov.tw/Fidbweb/index.jsp" target="_blank" rel="noopener noreferrer" class="p-4 bg-white hover:bg-amber-50/50 border border-stone-200 hover:border-amber-300 rounded-2xl transition flex items-center space-x-3.5 shadow-2xs group"> 
                        <div class="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition"> 
                            <i class="fa-solid fa-industry"></i> 
                        </div> 
                        <div class="overflow-hidden flex-1"> 
                            <div class="font-bold text-xs text-stone-900 truncate">工廠登記查詢</div> 
                            <div class="text-[10px] text-stone-400 truncate mt-0.5">工廠登記證查驗</div> 
                        </div> 
                        <i class="fa-solid fa-arrow-up-right-from-square text-xs text-stone-300 group-hover:text-amber-600"></i> 
                    </a> 

                    <!-- 謄本調閱 --> 
                    <a href="https://ep1.land.nat.gov.tw/Home/EpaperManual1" target="_blank" rel="noopener noreferrer" class="p-4 bg-white hover:bg-purple-50/50 border border-stone-200 hover:border-purple-300 rounded-2xl transition flex items-center space-x-3.5 shadow-2xs group"> 
                        <div class="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition"> 
                            <i class="fa-solid fa-file-lines"></i> 
                        </div> 
                        <div class="overflow-hidden flex-1"> 
                            <div class="font-bold text-xs text-stone-900 truncate">謄本調閱</div> 
                            <div class="text-[10px] text-stone-400 truncate mt-0.5">地政電傳謄本查詢系統</div> 
                        </div> 
                        <i class="fa-solid fa-arrow-up-right-from-square text-xs text-stone-300 group-hover:text-purple-600"></i> 
                    </a> 
                </div> 
            </div> 

            <!-- 區塊二：不動產稅費試算專區 --> 
            <div class="space-y-3"> 
                <div class="flex items-center space-x-2 px-1"> 
                    <i class="fa-solid fa-calculator text-indigo-500 text-sm"></i> 
                    <h3 class="text-xs font-bold uppercase tracking-wider text-stone-500">不動產稅費試算專區</h3> 
                </div> 
                <div class="grid grid-cols-2 md:grid-cols-5 gap-4"> 
                    <a href="https://net.tax.nat.gov.tw/PLRX/Lrx200d01/trial_lnd.html" target="_blank" rel="noopener noreferrer" class="p-4 bg-white hover:bg-indigo-50/50 border border-stone-200 hover:border-indigo-300 rounded-2xl transition flex flex-col justify-between shadow-2xs group"> 
                        <div class="flex items-center justify-between mb-3"> 
                            <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs"> 
                                <i class="fa-solid fa-landmark"></i> 
                            </div> 
                            <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-stone-300 group-hover:text-indigo-600"></i> 
                        </div> 
                        <div> 
                            <div class="font-bold text-xs text-stone-900">地價稅試算</div> 
                            <div class="text-[10px] text-stone-400 mt-0.5">地方稅網路申報</div> 
                        </div> 
                    </a> 

                    <a href="https://www.etax.nat.gov.tw/etwmain/etw158w/51" target="_blank" rel="noopener noreferrer" class="p-4 bg-white hover:bg-indigo-50/50 border border-stone-200 hover:border-indigo-300 rounded-2xl transition flex flex-col justify-between shadow-2xs group"> 
                        <div class="flex items-center justify-between mb-3"> 
                            <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs"> 
                                <i class="fa-solid fa-percent"></i> 
                            </div> 
                            <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-stone-300 group-hover:text-indigo-600"></i> 
                        </div> 
                        <div> 
                            <div class="font-bold text-xs text-stone-900">土地增值稅</div> 
                            <div class="text-[10px] text-stone-400 mt-0.5">財政部稅務入口網</div> 
                        </div> 
                    </a> 

                    <a href="https://www.kctax.gov.tw/Calculate/HOUCompute2.aspx?1=1&MenuID=1076" target="_blank" rel="noopener noreferrer" class="p-4 bg-white hover:bg-indigo-50/50 border border-stone-200 hover:border-indigo-300 rounded-2xl transition flex flex-col justify-between shadow-2xs group"> 
                        <div class="flex items-center justify-between mb-3"> 
                            <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs"> 
                                <i class="fa-solid fa-house"></i> 
                            </div> 
                            <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-stone-300 group-hover:text-indigo-600"></i> 
                        </div> 
                        <div> 
                            <div class="font-bold text-xs text-stone-900">房屋稅 (高雄)</div> 
                            <div class="text-[10px] text-stone-400 mt-0.5">高雄市稅捐稽徵處</div> 
                        </div> 
                    </a> 

                    <a href="https://www.etax.nat.gov.tw/etwmain/etw158w/53" target="_blank" rel="noopener noreferrer" class="p-4 bg-white hover:bg-indigo-50/50 border border-stone-200 hover:border-indigo-300 rounded-2xl transition flex flex-col justify-between shadow-2xs group"> 
                        <div class="flex items-center justify-between mb-3"> 
                            <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs"> 
                                <i class="fa-solid fa-file-contract"></i> 
                            </div> 
                            <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-stone-300 group-hover:text-indigo-600"></i> 
                        </div> 
                        <div> 
                            <div class="font-bold text-xs text-stone-900">契稅試算</div> 
                            <div class="text-[10px] text-stone-400 mt-0.5">財政部稅務入口網</div> 
                        </div> 
                    </a> 

                    <a href="https://net.tax.nat.gov.tw/PLRX/Lrx200d01/trial_cht.html" target="_blank" rel="noopener noreferrer" class="p-4 bg-white hover:bg-indigo-50/50 border border-stone-200 hover:border-indigo-300 rounded-2xl transition flex flex-col justify-between shadow-2xs group"> 
                        <div class="flex items-center justify-between mb-3"> 
                            <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs"> 
                                <i class="fa-solid fa-calculator"></i> 
                            </div> 
                            <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-stone-300 group-hover:text-indigo-600"></i> 
                        </div> 
                        <div> 
                            <div class="font-bold text-xs text-stone-900">地方稅綜合試算</div> 
                            <div class="text-[10px] text-stone-400 mt-0.5">地方稅申報入口網</div> 
                        </div> 
                    </a> 
                </div> 
            </div> 

            <!-- 區塊三：專業評估與試算工具 (Modal 入口 - 已移動至此) --> 
            <div class="space-y-3"> 
                <div class="flex items-center space-x-2 px-1"> 
                    <i class="fa-solid fa-calculator text-[#C59B63] text-sm"></i> 
                    <h3 class="text-xs font-bold uppercase tracking-wider text-stone-500">專業評估與試算工具</h3> 
                </div> 
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4"> 
                    <!-- 1. 土地基本資料 --> 
                    <div onclick="if(typeof openLandModal==='function') openLandModal()" class="p-4 bg-white hover:bg-amber-50/50 border border-stone-200 hover:border-amber-300 rounded-2xl transition flex items-center space-x-3.5 shadow-2xs group cursor-pointer"> 
                        <div class="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition"> 
                            <i class="fa-solid fa-map"></i> 
                        </div> 
                        <div class="overflow-hidden flex-1"> 
                            <div class="font-bold text-xs text-stone-900 truncate">土地基本資料</div> 
                            <div class="text-[10px] text-stone-400 truncate mt-0.5">多地號面積與持分試算</div> 
                        </div> 
                        <i class="fa-solid fa-arrow-right text-xs text-stone-300 group-hover:text-amber-600"></i> 
                    </div> 

                    <!-- 2. 保存登記建物 --> 
                    <div onclick="if(typeof openRegisteredBuildingModal==='function') openRegisteredBuildingModal()" class="p-4 bg-white hover:bg-sky-50/50 border border-stone-200 hover:border-sky-300 rounded-2xl transition flex items-center space-x-3.5 shadow-2xs group cursor-pointer"> 
                        <div class="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition"> 
                            <i class="fa-solid fa-building"></i> 
                        </div> 
                        <div class="overflow-hidden flex-1"> 
                            <div class="font-bold text-xs text-stone-900 truncate">保存登記建物</div> 
                            <div class="text-[10px] text-stone-400 truncate mt-0.5">建號試算與持分坪數</div> 
                        </div> 
                        <i class="fa-solid fa-arrow-right text-xs text-stone-300 group-hover:text-sky-600"></i> 
                    </div> 

                    <!-- 3. 未保存登記建物 --> 
                    <div onclick="if(typeof openUnregisteredBuildingModal==='function') openUnregisteredBuildingModal()" class="p-4 bg-white hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-300 rounded-2xl transition flex items-center space-x-3.5 shadow-2xs group cursor-pointer"> 
                        <div class="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition"> 
                            <i class="fa-solid fa-house-chimney"></i> 
                        </div> 
                        <div class="overflow-hidden flex-1"> 
                            <div class="font-bold text-xs text-stone-900 truncate">未保存登記建物</div> 
                            <div class="text-[10px] text-stone-400 truncate mt-0.5">增補建廠房面積評估</div> 
                        </div> 
                        <i class="fa-solid fa-arrow-right text-xs text-stone-300 group-hover:text-emerald-600"></i> 
                    </div> 

                    <!-- 4. 太陽能試算 --> 
                    <div onclick="if(typeof openSolarModal==='function') openSolarModal()" class="p-4 bg-white hover:bg-amber-50/50 border border-stone-200 hover:border-amber-400 rounded-2xl transition flex items-center space-x-3.5 shadow-2xs group cursor-pointer"> 
                        <div class="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition"> 
                            <i class="fa-solid fa-solar-panel"></i> 
                        </div> 
                        <div class="overflow-hidden flex-1"> 
                            <div class="font-bold text-xs text-stone-900 truncate">太陽能試算</div> 
                            <div class="text-[10px] text-stone-400 truncate mt-0.5">屋頂坪數與發電效益精算</div> 
                        </div> 
                        <i class="fa-solid fa-arrow-right text-xs text-stone-300 group-hover:text-amber-600"></i> 
                    </div> 

                    <!-- 5. 土地變更評估 --> 
                    <div onclick="if(typeof openLandChangeModal==='function') openLandChangeModal()" class="p-4 bg-white hover:bg-indigo-50/50 border border-stone-200 hover:border-indigo-300 rounded-2xl transition flex items-center space-x-3.5 shadow-2xs group cursor-pointer"> 
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

            <!-- 區塊四：官方網站與後台管理 --> 
            <div class="space-y-3"> 
                <div class="flex items-center space-x-2 px-1"> 
                    <i class="fa-solid fa-globe text-sky-500 text-sm"></i> 
                    <h3 class="text-xs font-bold uppercase tracking-wider text-stone-500">官方網站與後台管理</h3> 
                </div> 
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5"> 
                    <!-- 官網卡片 --> 
                    <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"> 
                        <div> 
                            <div class="flex items-center justify-between mb-3"> 
                                <span class="px-2.5 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-lg text-[10px] font-bold">官方網站</span> 
                                <div class="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-base group-hover:scale-105 transition"> 
                                    <i class="fa-solid fa-globe"></i> 
                                </div> 
                            </div> 
                            <h4 class="font-bold text-sm text-stone-900 mb-1">睿立集團官方網站</h4> 
                            <p class="text-xs text-stone-500 leading-relaxed mb-4"> 
                                快速開啟集團官方網站，對外展示綠能與土地開發實績。 
                            </p> 
                        </div> 
                        <div class="pt-3 border-t border-stone-100 flex items-center justify-between"> 
                            <button type="button" onclick="navigator.clipboard.writeText('https://www.yuanyeh.com.tw/'); alert('📋 已成功複製官網網址！');" class="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-2xs"> 
                                <i class="fa-solid fa-copy text-[10px]"></i><span>複製網址</span> 
                            </button> 
                            <a href="https://www.yuanyeh.com.tw/" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition shadow-2xs flex items-center space-x-1.5"> 
                                <i class="fa-solid fa-external-link text-[10px]"></i><span>進入官網</span> 
                            </a> 
                        </div> 
                    </div> 

                    <!-- 官網後台卡片 --> 
                    <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"> 
                        <div> 
                            <div class="flex items-center justify-between mb-3"> 
                                <span class="px-2.5 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg text-[10px] font-bold">官方網站後台</span> 
                                <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base group-hover:scale-105 transition"> 
                                    <i class="fa-solid fa-lock"></i> 
                                </div> 
                            </div> 
                            <h4 class="font-bold text-sm text-stone-900 mb-1">官方網站後台</h4> 
                            <p class="text-xs text-stone-500 leading-relaxed mb-4"> 
                                專為內部管理打造的網站後台，用於維護官網內容與相關設定。 
                            </p> 
                        </div> 
                        <div class="pt-3 border-t border-stone-100 flex items-center justify-between"> 
                            <button type="button" onclick="navigator.clipboard.writeText('https://www.yuanyeh.com.tw/AWS-Backyard/login'); alert('📋 已成功複製後台登入網址！');" class="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-2xs"> 
                                <i class="fa-solid fa-copy text-[10px]"></i><span>複製網址</span> 
                            </button> 
                            <a href="https://www.yuanyeh.com.tw/AWS-Backyard/login" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-2xs flex items-center space-x-1.5"> 
                                <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i><span>進入後台</span> 
                            </a> 
                        </div> 
                    </div> 
                </div> 
            </div> 

        </div> 
    `; 
} 

// 掛載至全域 window，確保 switchModule 可以正確呼叫 
window.renderToolsModule = renderToolsModule;
