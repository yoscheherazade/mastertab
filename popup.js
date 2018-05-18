function loadCategories() {
    iterateLsKeys();
};

function iterateLsKeys() {
    let values = [],
        keys = Object.keys(localStorage);

    for (let i = 0; i < keys.length; i++) {
        values.push(keys[i]);
        createListItems(keys[i]);
    }

    values.forEach(function (value) {
        //Create option element
        const option = document.createElement('option');
        //Create text node and append to li
        option.appendChild(document.createTextNode(value));
        // Get select from HTML
        const select = document.getElementById('select-category');
        // Add option to select
        select.add(option);
    });
}

function createListItems(categoryName) {
    let ui = document.getElementById('output-links');
    ui.innerHTML += `
    <li>
        <button href="#" id="${categoryName}" class="btn btn-outline-primary listed-category"> ${categoryName}
        </button>
        <i class="float-right material-icons delete-btn text-danger">delete_forever</i>
    </li><br>
    `;
}

function groupURLs(categoryName) {
    let values = Object.values(localStorage),
        key = Object.keys(localStorage).indexOf(categoryName),
        keys = Object.keys(localStorage),
        linksArray = [];

    if (keys.includes(categoryName)) {
        for (let i = 0; i < JSON.parse(values[key]).length; i++) {
            value = JSON.parse(values[key]);
            value = value[i].tabURL;
            //console.log(value);
            linksArray.push(value);
        }
    }
    openTabsInNewWindow(categoryName, linksArray);
}

function openTabsInNewWindow(categoryName, array) {
    let linkArray = array;
    let category = categoryName;

    // Open new window with all tabs in array
    chrome.windows.create({
        url: linkArray
    });
}

/*
=================
Event Listeners 
=================
*/
document.addEventListener("DOMContentLoaded", loadCategories);

// Listen for category input
let categoryName = document.getElementById('createNewCategory').value;

document.getElementById('add-category-btn').addEventListener('click', addNewCategory);

// Listen for select from dropdown
const categoryValue = document.getElementById('select-category');

// Listen for save one tab
document.getElementById('saveOneTab').addEventListener('click', getTabUrl);

// Listen for save all tabs
document.getElementById('saveAllTabs').addEventListener('click', getAllWindowUrls);

document.querySelector('body').addEventListener('click', function (event) {
    if (event.target.classList.contains('listed-category')) {
        const nameInput = event.target.id;
        groupURLs(nameInput);
    }
    if (event.target.classList.contains('delete-btn')) {
        const parentId = event.target.previousElementSibling.id;
        deleteCategory(parentId);
        removeFromUI(parentId);
    }
    event.preventDefault();
});

/*
==============================
    CATEGORY INFO SECTION
==============================
*/

// Adds new category after 'ADD' button is pressed
function addNewCategory() {
    // Add category name to select list
    const select = document.getElementById('select-category');
    const option = document.createElement("option");
    option.text = document.getElementById('createNewCategory').value;
    // Check that category name is not blank
    if (option.text !== '') {
        select.add(option);
        // Get category name
        let name = option.text;

        // Clear input field
        document.getElementById('createNewCategory').value = '';

        // Alert new category added
        showAlert(`${name} category successfully added! Select it from the dropdown below`, 'alert alert-success');
    } else {
        // Alert that category name cannot be blank
        showAlert('Category name cannot be blank', 'alert alert-danger');
    }
}

function deleteCategory(categoryName) {
    // Set text as category name
    let name = categoryName;
    // Delete category
    localStorage.removeItem(name);
    //removeFromUI(name);
}


/* 
==========================
    GET TAB (link) INFO
=========================
*/
function generateRandomKey() {
    return '_' + Math.random().toString(36).substr(2, 9);
};

function getTabUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tabURL = tabs[0].url;
        const tabName = tabs[0].title;
        const tabKey = generateRandomKey();
        const categoryName = categoryValue.value;

        if (categoryName === 'Select one...') {
            showAlert('Please select a category', 'alert alert-danger');
        } else {
            storeCategory(categoryName, tabURL, tabName, tabKey);
        }
    });

}

function getAllWindowUrls() {
    chrome.windows.getCurrent({ populate: true }, function (windows) {
        windows.tabs.forEach(function (tab) {
            tabURL = tab.url;
            tabName = tab.title;
            tabKey = generateRandomKey();
            const categoryName = categoryValue.value;

            if (categoryName === 'Select one...') {
                showAlert('Please select a category', 'alert alert-danger');
            } else {
                storeCategory(categoryName, tabURL, tabName, tabKey);
            }
        });
    });
}


/*
================================
  LOCAL STORAGE (Testing only)
================================
*/

function storeCategory(categoryName, tabURL, tabName, tabKey) {
    const tabInfo = { categoryName: categoryName, tabName: tabName, tabURL: tabURL, tabKey: tabKey };
    // check if category exists
    if (localStorage.getItem(categoryName)) {
        // if so, retrieve category
        let getStored = JSON.parse(localStorage.getItem(categoryName));
        // push tab info into local storage value
        getStored.push(tabInfo);
        // reset local storage value
        localStorage.setItem(`${categoryName}`, JSON.stringify(getStored))
    } else {
        createListItems(categoryName);
        // if not, create arr and push tabInfo
        let arr = [];
        arr.push(tabInfo);
        let storedCategory = localStorage.setItem(
            `${categoryName}`,
            JSON.stringify(arr)
        );
    }

}


/*
=============================
        UI CHANGES
=============================
*/

// Show alert message
function showAlert(message, className) {
    // Clear any remaining alerts
    this.clearAlert();
    // Create a div
    const div = document.createElement('div');
    // Add classes
    div.className = className;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector('.main-container');
    // Get searchbox
    const categoryGroup = document.querySelector('#create-category-group');
    // Insert alert
    container.insertBefore(div, categoryGroup);

    //Timeout after 3 seconds
    setTimeout(() => {
        this.clearAlert();
    }, 2000);
}

// Clear alert message
function clearAlert() {
    const currentAlert = document.querySelector('.alert');

    if (currentAlert) {
        //clear current alert if there is one
        currentAlert.remove();
    }
}

// Delete from UI
function removeFromUI(categoryName) {
    // Get clicked button
    let btn = event.target;
    // Get parent element
    let parent = btn.parentElement;
    // Remove parent element from UI
    parent.innerHTML = '';

}
