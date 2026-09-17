<!-- Modal 1: 土地基本資料（已補齊上方所有權人區塊） -->
    <div id="land-modal" class="fixed inset-0 bg-black/60 backdrop-blur-xs hidden flex items-center justify-center z-[9999] p-3 overflow-y-auto">
        <div class="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 text-stone-800 my-4">
            
            <!-- 彈窗頂部 -->
            <div class="bg-[#2C2A29] text-white px-6 py-4 flex justify-between items-center shrink-0">
                <h3 class="font-bold text-sm flex items-center tracking-wide">
                    <i class="fa-solid fa-map-location-dot text-[#C59B63] mr-2 text-base"></i> 土地基本資料
                </h3>
                <button type="button" onclick="closeLandModal()" class="text-stone-400 hover:text-white cursor-pointer transition">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>
            </div>

            <!-- 內容主體 -->
            <div class="p-6 space-y-4 text-xs bg-stone-50/50 flex-1 overflow-y-auto">
                
                <!-- 💡 補齊第二張圖：所有權人、縣市、區域、地段區塊 -->
                <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                            <label class="font-bold block mb-1 text-stone-700">所有權人</label>
                            <input type="text" id="land-owner-name" class="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C59B63]" placeholder="請輸入所有權人姓名">
                        </div>
                        <div>
                            <label class="font-bold block mb-1 text-stone-700">縣市</label>
                            <input type="text" id="land-city" class="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C59B63]" placeholder="例如：彰化縣">
                        </div>
                        <div>
                            <label class="font-bold block mb-1 text-stone-700">區域</label>
                            <input type="text" id="land-district" class="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C59B63]" placeholder="例如：鹿港鎮">
                        </div>
                        <div>
                            <label class="font-bold block mb-1 text-stone-700">地段</label>
                            <input type="text" id="land-section" class="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C59B63]" placeholder="例如：頂番段">
                        </div>
                    </div>
                </div>

                <!-- 下方：地號詳細列表區 -->
                <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                    <div class="flex justify-between items-center pb-2">
                        <span class="font-bold text-stone-800 text-xs">土地筆數列表</span>
                        <button type="button" onclick="addLandRow()" class="px-3.5 py-1.5 btn-gold hover:opacity-90 rounded-xl font-bold text-xs shadow-2xs transition flex items-center space-x-1 cursor-pointer">
                            <i class="fa-solid fa-plus text-[10px]"></i><span>新增土地</span>
                        </button>
                    </div>

                    <!-- 滾動列表容器 -->
                    <div class="overflow-x-auto w-full">
                        <div id="land-rows-container" class="space-y-2 min-w-[850px] max-h-60 overflow-y-auto pr-1"></div>
                    </div>

                    <!-- 總計區 -->
                    <div class="pt-3 border-t border-stone-100 flex flex-wrap justify-around items-center font-bold text-xs text-stone-700">
                        <div>總面積：<span id="sum-area" class="font-mono text-amber-700 font-bold ml-1">0.00 ㎡</span></div>
                        <div>持分總面積：<span id="sum-sqm" class="font-mono text-amber-700 font-bold ml-1">0.00 ㎡</span></div>
                        <div>持分總坪數：<span id="sum-ping" class="font-mono text-amber-700 font-bold ml-1">0.00 坪</span></div>
                    </div>
                </div>
            </div>

            <!-- 底端按鈕 -->
            <div class="px-6 py-3.5 bg-stone-100 border-t border-stone-200 flex justify-end shrink-0">
                <button type="button" onclick="closeLandModal()" class="px-5 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded-xl font-bold transition text-xs cursor-pointer shadow-2xs">
                    關閉
                </button>
            </div>
        </div>
    </div>
