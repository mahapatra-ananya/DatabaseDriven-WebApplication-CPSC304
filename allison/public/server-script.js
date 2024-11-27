const urlParam = new URLSearchParams(window.location.search);
const SERVERID = urlParam.get('serverid');

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    // checkDbConnection();

    fetchTableData();
};


// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    //fetchAndDisplayAvatars();
}
