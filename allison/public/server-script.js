const urlParam = new URLSearchParams(window.location.search);
const SERVERID = urlParam.get('serverid');

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    // checkDbConnection();
    fetchTableData();

    const addChannelBtn = document.querySelector('#addChannelBtn');
    const createServerBtn = document.querySelector('#createServerBtn');
    const nextBtn = document.querySelector('#nextBtn');

    addChannelBtn.addEventListener('click', addChannel);
    createServerBtn.addEventListener('click', insertServerChannelAdminTables)
    nextBtn.addEventListener('click', goToServerPage);
};


// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayAvatars();
}
