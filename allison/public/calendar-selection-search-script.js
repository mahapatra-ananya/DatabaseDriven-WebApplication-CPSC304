
function addFilter() {
    const searchQueryGroup = document.querySelector('.searchQuery');

    // PARENT FILTER ITEM
    const newFilterItem = document.createElement('div');
    newFilterItem.className = 'filterItem'

    // AND OR SELECT
    const newAndOrSelect = document.createElement('select')
    newAndOrSelect.name = 'andOR'
    newAndOrSelect.className = 'andOr-select'
    //// options
    const newLogicalOperatorOption = document.createElement('option');
    newLogicalOperatorOption.value = ''
    newLogicalOperatorOption.textContent = '--Logical Operator--';
    newAndOrSelect.appendChild(newLogicalOperatorOption);
    const newAndOption = document.createElement('option');
    newAndOption.value = 'AND'
    newAndOption.textContent = 'AND'
    newAndOrSelect.appendChild(newAndOption);
    const newOrOption = document.createElement('option');
    newOrOption.value = 'OR'
    newOrOption.textContent = 'OR'
    newAndOrSelect.appendChild(newOrOption);
    ////
    newFilterItem.appendChild(newAndOrSelect)

    // FILTER SELECT
    const newFilterSelect = document.createElement('select')
    newFilterSelect.name = 'filter'
    newFilterSelect.className = 'filter-select'
    //// OPTIONS
    const newFilterOption = document.createElement('option');
    newFilterOption.value = ''
    newFilterOption.textContent = '--Filter--';
    newFilterSelect.appendChild(newFilterOption);
    const newYearOption = document.createElement('option');
    newYearOption.value = 'year'
    newYearOption.textContent = "Year"
    newFilterSelect.appendChild(newYearOption);
    const newMonthOption = document.createElement('option');
    newMonthOption.value = 'month'
    newMonthOption.textContent = 'Month'
    newFilterSelect.appendChild(newMonthOption);
    const newDayOption = document.createElement('option');
    newDayOption.value = 'day'
    newDayOption.textContent = 'Day'
    newFilterSelect.appendChild(newDayOption);
    const newDurationOption = document.createElement('option')
    newDurationOption.value = 'duration'
    newDurationOption.textContent = "Duration"
    newFilterSelect.appendChild(newDurationOption)
    ////
    newFilterItem.appendChild(newFilterSelect);

// OPERATOR SELECT
    const newOperatorSelect = document.createElement('select')
    newOperatorSelect.name = 'operator'
    newOperatorSelect.className = 'operator-select'
    //// OPTIONS
    const newOperatorOption = document.createElement('option');
    newOperatorOption.value = ''
    newOperatorOption.textContent = '--Operator--';
    newOperatorSelect.appendChild(newOperatorOption);
    const newGreaterOption = document.createElement('option');
    newGreaterOption.value = '>'
    newGreaterOption.textContent = ">"
    newOperatorSelect.appendChild(newGreaterOption);
    const newLessOption = document.createElement('option');
    newLessOption.value = '<'
    newLessOption.textContent = '<'
    newOperatorSelect.appendChild(newLessOption);
    const newEqualOption = document.createElement('option');
    newEqualOption.value = '='
    newEqualOption.textContent = '='
    newOperatorSelect.appendChild(newEqualOption);
    const newEqualGreaterOption = document.createElement('option')
    newEqualGreaterOption.value = '>='
    newEqualGreaterOption.textContent = ">="
    newOperatorSelect.appendChild(newEqualGreaterOption)
    const newEqualLessOption = document.createElement('option')
    newEqualLessOption.value = '<='
    newEqualLessOption.textContent = "<="
    newOperatorSelect.appendChild(newEqualLessOption)
    ////
    newFilterItem.appendChild(newOperatorSelect);

// FILTER INPUT
    const filterInput = document.createElement('input');
    filterInput.type = 'number'
    filterInput.className = 'filterInput'
    filterInput.placeholder = 'Enter a number'
    filterInput.min = '1'
    newFilterItem.appendChild(filterInput)


    searchQueryGroup.appendChild(newFilterItem);
}

function applyFilters() {

}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    // checkDbConnection();

    fetchTableData();

    const addFilterBtn = document.querySelector('.addFilterBtn')
    const

    addFilterBtn.addEventListener('click', addFilter);

};


// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
}
