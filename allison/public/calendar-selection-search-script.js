
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

function removeFilter() {
    const searchQuery = document.querySelector('.searchQuery')
    const lastChild = searchQuery.lastChild;
    if (lastChild.className !== 'firstFilterItem') {
        lastChild.remove()
    }
}

function isValidYearInput(input) {
    return input.length === 4;
}

function isValidMonthInput(input) {
    return input <= 12;
}

function isValidDay(input) {
    return input <= 31;
}

async function applyFilters() {
    // clean up leftover error messages
    const leftOverErrorMessages = document.querySelectorAll('.error-message');
    for (const msg of leftOverErrorMessages) {
        msg.remove();
    }
    // error message set up
    const errorMessage = document.createElement('p');
    errorMessage.textContent = '';
    errorMessage.className = 'error-message';


    // GET THE FILTERITEMS
    const filterItems = document.querySelectorAll('.filterItem');
    let queryString = 'SELECT * FROM Event WHERE';

    //////////////////// Get first filter item
    const firstFilterItem = document.querySelector('.firstFilterItem');
    const firstFilter = firstFilterItem.children[0].value;
    const firstOperator = firstFilterItem.children[1].value;
    const firstInput = firstFilterItem.children[2].value;

    if (firstFilter === '' || firstOperator === '' || firstInput.trim().length < 1) {
        errorMessage.textContent = 'Please select a filter and operator and enter a number'
        firstFilterItem.appendChild(errorMessage);
        return;
    } else {
        if (firstFilter === 'year') {
            if (!isValidYearInput(firstInput)) {
                errorMessage.textContent = 'Please enter a valid year (exactly 4 digits)'
                firstFilterItem.appendChild(errorMessage);
                return;
            } else {
                queryString = `${queryString} EXTRACT(year from EventDateTime) ${firstOperator} ${firstInput}`;
            }
        } else if (firstFilter === 'month') {
            if (!isValidMonthInput(firstInput)) {
                errorMessage.textContent = 'Please enter a valid month (value from 1 to 12)'
                firstFilterItem.appendChild(errorMessage);
                return;
            } else {
                queryString = `${queryString} EXTRACT(month from EventDateTime) ${firstOperator} ${firstInput}`;
            }
        } else if (firstFilter === 'day') {
            if (!isValidDay(firstInput)) {
                errorMessage.textContent = 'Please enter a valid day (value from 1 to 31)'
                firstFilterItem.appendChild(errorMessage);
                return;
            } else {
                queryString = `${queryString} EXTRACT(month from EventDateTime) ${firstOperator} ${firstInput}`;
            }
        } else if (firstFilter === 'duration') {
            queryString = `${queryString} Duration ${firstOperator} ${firstInput}`;
        }
    }

    // queryString = `${firstFilter} ${firstOperator} ${firstInput}`
    console.log(`firstFilterItem: ${queryString}`);

    /////// GET THE OTHER filteritems
    if (filterItems && filterItems.length > 0) {
        // FOR EACH FILTER ITEM
        for (const filterItem of filterItems) {
            const logicalOp = filterItem.children[0].value;
            const filter = filterItem.children[1].value;
            const operator = filterItem.children[2].value;
            const input = filterItem.children[3].value;
            console.log(`logicalOp: ${logicalOp} filter: ${filter} operator: ${operator} input: ${input}`);
            if (logicalOp === '' || filter === '' || operator === '' || input.trim().length < 1) {
                errorMessage.textContent = 'Please select a logical operator, filter, and operator and enter a number'
                filterItem.appendChild(errorMessage);
                return;
            } else {
                if (filter === 'year') {
                    if (!isValidYearInput(input)) {
                        errorMessage.textContent = 'Please enter a valid year (exactly 4 digits)'
                        filterItem.appendChild(errorMessage);
                        return;
                    } else {
                        queryString = `${queryString} ${logicalOp} EXTRACT(year from EventDateTime) ${operator} ${input}`;
                    }
                } else if (filter === 'month') {
                    if (!isValidMonthInput(input)) {
                        errorMessage.textContent = 'Please enter a valid month (value from 1 to 12)'
                        filterItem.appendChild(errorMessage);
                        return;
                    } else {
                        queryString = `${queryString} ${logicalOp} EXTRACT(month from EventDateTime) ${operator} ${input}`;
                    }
                } else if (filter === 'day') {
                    if (!isValidDay(input)) {
                        errorMessage.textContent = 'Please enter a valid day (value from 1 to 31)'
                        filterItem.appendChild(errorMessage);
                        return;
                    } else {
                        queryString = `${queryString} ${logicalOp} EXTRACT(month from EventDateTime) ${operator} ${input}`;
                    }
                } else if (filter === 'duration') {
                    queryString = `${queryString} ${logicalOp} Duration ${operator} ${input}`;
                }
            }
        }

        console.log(queryString)
        // INPUT CHECKING
        // if Filter = Year, must be 4 digits
        // if Filter = Month, max value is 12
        // if Filter = Day, max value 31
        //  IF any value within an item is = '', then do not push that query string
        // ELSE IF item PASS,
        // push to query string
    }

    // IF FINAL QUERY STRING IS '', just fetch and display the entire table

    // ELSE FETCH AND DISPLAY FILTERED EVENTS ORDERED BY ASCENDING

    //////////////////////// QUERY WITH THE FILTERS
    const response = await fetch('/filter-events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            QueryString: queryString,
        })
    });

    const responseData = await response.json();
    const filteredEvents = responseData.filteredEvents;
    console.log(filteredEvents);

    // Always clear old, already fetched data before new fetching process.
    // if (insertServerGroup) {
    //     insertServerGroup.innerHTML = '';
    // }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    // checkDbConnection();

    fetchTableData();

    const addFilterBtn = document.querySelector('.addFilterBtn')
    const removeFilterBtn = document.querySelector('.removeFilterBtn')
    const applyFiltersBtn = document.querySelector('.applyFiltersBtn')

    addFilterBtn.addEventListener('click', addFilter);
    removeFilterBtn.addEventListener('click', removeFilter)
    applyFiltersBtn.addEventListener('click', applyFilters);

};


// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
}
