/** * 開啟集團案件完整建檔與評估中心（八大區塊彈窗） 
 */ 
export function openAddCaseModal(year = '2026') { 
    const yearInput = document.getElementById('edit-case-year'); 
    const idInput = document.getElementById('edit-case-id'); 

    if (yearInput) yearInput.value = year; 
    if (idInput) idInput.value = ''; // 留空代表新增模式 

    // 清空主要輸入欄位 
    const clientInput = document.getElementById('edit-case-client'); 
    const nameInput = document.getElementById('edit-case-name'); 
    const detailInput = document.getElementById('edit-case-service-detail'); 
    const addressInput = document.getElementById('edit-case-address'); 
    const landNoInput = document.getElementById('edit-case-land-no'); // 地段地號
    const descInput = document.getElementById('edit-case-desc'); 
    const noteInput = document.getElementById('edit-case-note'); 
    const amountInput = document.getElementById('edit-case-amount'); 

    if (clientInput) clientInput.value = ''; 
    if (nameInput) nameInput.value = ''; 
    if (detailInput) detailInput.value = ''; 
    if (addressInput) addressInput.value = ''; 
    if (landNoInput) landNoInput.value = ''; 
    if (descInput) descInput.value = ''; 
    if (noteInput) noteInput.value = ''; 
    if (amountInput) amountInput.value = ''; 

    // 💡 關鍵修正：每次打開新增案件時，自動清空並初始化一筆空白土地輸入列
    const landContainer = document.getElementById('land-rows-container');
    if (landContainer) {
        landContainer.innerHTML = ''; // 清空舊資料
        if (typeof window.addLandRow === 'function') {
            window.addLandRow(); // 自動新增第一筆空白列
        }
    }

    const modal = document.getElementById('editCaseModal'); 
    if (modal) modal.classList.remove('hidden'); 
}
// 在 case-edit.js 的最下方加上這行：
window.openAddCaseModal = openAddCaseModal;
