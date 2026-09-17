<!-- Modal 1: 土地基本資料（系統統一風格 + 完整欄位） -->
    <div id="land-modal" class="fixed inset-0 bg-black/60 backdrop-blur-xs hidden flex items-center justify-center z-[60] p-3 overflow-y-auto">
        <div class="bg-white w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 text-stone-800 my-4">
            
            <!-- 1. 彈窗頂部標題（睿立深灰色） -->
            <div class="bg-[#2C2A29] text-white px-6 py-4 flex justify-between items-center shrink-0">
                <h3 class="font-bold text-sm flex items-center tracking-wide">
                    <i class="fa-solid fa-map-location-dot text-[#C59B63] mr-2 text-base"></i> 土地基本資料
                </h3>
                <button type="button" onclick="closeLandModal()" class="text-stone-400 hover:text-white cursor-pointer transition">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>
            </div>

            <!-- 2. 彈窗內容主體 -->
            <div class="p-6 space-y-4 text-xs bg-stone-50/50 flex-1 overflow-y-auto">
                
                <!-- 上半部：所有權人與地段區域 -->
                <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                            <label class="font-bold block mb-1 text-stone-700">所有權人</label>
                            <input type="text" id="land-owner-name" class="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#C59B63]" placeholder="請輸入所有權人姓名">
                        </div>
                        <div>
                            <label class="font-bold block mb-1 text-stone-700">縣市</label>
                            <input type="text" id="land-city" class="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#C59B63]" placeholder="例如：彰化縣">
                        </div>
                        <div>
                            <label class="font-bold block mb-1 text-stone-700">區域</label>
                            <input type="text" id="land-district" class="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#C59B63]" placeholder="例如：鹿港鎮">
                        </div>
                        <div>
                            <label class="font-bold block mb-1 text-stone-700">地段</label>
                            <input type="text" id="land-section" class="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#C59B63]" placeholder="例如：頂番段">
                        </div>
                    </div>
                </div>

                <!-- 下半部：地號詳細列表區 -->
                <div class="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                    <div class="flex justify-between items-center pb-2 border-b border-stone-100">
                        <span class="font-bold text-stone-800 text-xs">地號詳細列表</span>
                        <button type="button" onclick="addLandRow()" class="px-3.5 py-1.5 btn-gold hover:opacity-90 rounded-xl font-bold text-xs shadow-2xs transition flex items-center space-x-1 cursor-pointer">
                            <i class="fa-solid fa-plus text-[10px]"></i><span>新增地號</span>
                        </button>
                    </div>

                    <!-- 滾動表格容器 -->
                    <div class="overflow-x-auto w-full">
                        <div class="min-w-[950px] space-y-2">
                            <!-- 完整表頭 Header -->
                            <div class="grid grid-cols-[1fr_1fr_1.2fr_0.9fr_0.9fr_1.2fr_0.9fr_0.9fr_1fr_32px] gap-2 px-2 py-1.5 text-[11px] font-bold text-stone-600 text-center bg-stone-100/80 rounded-xl border border-stone-200">
                                <div>地號</div>
                                <div>登記日期</div>
                                <div>使用分區/類別</div>
                                <div>地目</div>
                                <div>面積 (㎡)</div>
                                <div>持分 (分子/分母)</div>
                                <div>持分面積 (㎡)</div>
                                <div>持分面積 (坪)</div>
                                <div>他項權利</div>
                                <div>刪除</div>
                            </div>

                            <!-- JS 動態新增資料列容器 -->
                            <div id="land-rows-container" class="space-y-2 max-h-60 overflow-y-auto pr-1"></div>
                        </div>
                    </div>

                    <!-- 底部總計區 -->
                    <div class="pt-2 flex flex-wrap justify-end items-center gap-6 font-bold text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <div>總面積：<span id="sum-area" class="font-mono text-amber-700 font-bold">0.00 ㎡</span></div>
                        <div>持分總平方公尺：<span id="sum-sqm" class="font-mono text-amber-700 font-bold">0.00 ㎡</span></div>
                        <div>持分總坪數：<span id="sum-ping" class="font-mono text-emerald-700 font-bold">0.00 坪</span></div>
                    </div>
                </div>
            </div>

            <!-- 3. 底端按鈕列 -->
            <div class="px-6 py-3.5 bg-stone-100 border-t border-stone-200 flex justify-end space-x-2.5 shrink-0">
                <button type="button" onclick="closeLandModal()" class="px-4 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded-xl font-bold transition text-xs cursor-pointer shadow-2xs">
                    取消
                </button>
                <button type="button" onclick="closeLandModal()" class="px-5 py-1.5 btn-gold hover:opacity-90 rounded-xl font-bold transition text-xs cursor-pointer shadow-2xs">
                    確認儲存土地資料
                </button>
            </div>
        </div>
    </div>
