//===================
// From React to LS
//===================

function createNewCategory(catId, catName) {
  const categoryKey = catId;
  const categoryName = catName;
  const categoryDateAdded = new Date();

  addCategoryToLS(categoryKey, categoryName, categoryDateAdded);
}

function addCategoryToLS(categoryKey, categoryName, categoryDateAdded) {
  let store = localStorage.setItem(`${categoryKey}`, JSON.stringify({ categoryName: categoryName, categoryKey: categoryKey, categoryDateAdded: categoryDateAdded }));
}

function retrieveOneCategory(categoryKey) {
  //return categories from local storage
  console.log(localStorage.getItem(categoryKey));
  return localStorage.getItem(categoryKey);
}

function retrieveCategories() {
  //return all categories as an array of objects from local storage
  let values = [],
    keys = Object.keys(localStorage),
    i = keys.length;

  while (i--) {
    values.push(localStorage.getItem(keys[i]));
  }
  console.log(values);
  return values;
}

function updateCategory(categoryKey, newName) {
  // I think this can just call Roudy's updateCategoryName() function
}

function deleteCategory(categoryKey) {
  localStorage.removeItem(categoryKey);
  // Or call Roudy's deleteCategory function
}

// this is the only function that doesn't work yet. I can't tell how it's sorting the array but it's not by date
function sortCategoriesDsc() {
  let values = [];
  //retrieve all categories and push into array
  values.push(retrieveCategories());
  //sort array in descending order
  values.sort(function (a, b) {
    return b - a;
  });

  console.table(values);
}



//===========================
// FOR TESTING PURPOSES ONLY
//===========================

function generateRandomKey() {
  return '_' + Math.random().toString(36).substr(2, 9);
};

// createNewCategory(generateRandomKey(), "Angular");
// createNewCategory(generateRandomKey(), "React");
// createNewCategory(generateRandomKey(), "Vue");
// createNewCategory(generateRandomKey(), "Ember");
sortCategoriesDsc();





