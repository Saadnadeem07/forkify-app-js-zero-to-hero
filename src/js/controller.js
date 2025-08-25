/**
 * Application Controller
 * - Wires up the UI (views) with the data layer (model)
 * - Registers event handlers exposed by view classes and calls model functions
 * - Orchestrates data flow: user actions -> controller -> model -> views
 *
 * Relationships
 * - Imports state-manipulation and fetch logic from `model.js`
 * - Imports multiple view classes from `views/*` to render UI and bind events
 * - Exposes `timeout` used by `helper.js` for request timeouts
 */
import * as model from './model.js';
import recipeView from './views/recipieView.js';
//import { loadSearchResults } from './model.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
const recipeContainer = document.querySelector('.recipe');

// if (module.hot) module.hot.accept();

/**
 * Utility: Promise-based timeout
 * - Consumed by `helper.js` (AJAX) to race network requests against a timeout
 * - Params: seconds (number)
 * - Returns: a Promise that rejects after given seconds
 */
export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 * Controller: Load and render a single recipe
 * Flow:
 * - Read recipe id from URL hash
 * - Show spinner in recipe view
 * - Update results list and bookmarks for UI consistency
 * - Ask model to load recipe data, then render it
 * Called by: `recipieView.addHandlerRender` on `load` and `hashchange`
 */
async function controlRecipes() {
  try {
    //get id
    let id = window.location.hash.slice(1);

    if (!id) id = '664c8f193e7aa067e94e897b';

    recipeView.spinner();

    resultView.update(model.getSearchResultPage());

    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError(error);
  }
}

/**
 * Controller: Execute a search and render paginated results
 * Flow:
 * - Show spinner in results area
 * - Read query from `searchView`
 * - Ask model to fetch search results, then render first page and pagination
 * Called by: `searchView.addHandlerSearch` (form submit)
 */
async function controlSearchResults() {
  try {
    //display loading spinner
    resultView.spinner();

    //get search
    let query = searchView.getQuery();

    //search results
    await model.loadSearchResults(query);

    //Render Results
    resultView.render(model.getSearchResultPage(1));
    console.log('model.state.search = ', model.state.search);
    paginationView.render(model.state.search);
  } catch (error) {
    //render errors
    //searchView.renderError(error);
    console.log('apka error  = ', error);
  }
}
/**
 * Controller: Handle pagination button clicks
 * Flow:
 * - Renders the requested page of results
 * - Updates the pagination controls based on new page
 * Called by: `paginationView.addHandlerClick`
 */
const controlPagination = function (goToPage) {
  // // 1) Render NEW results
  //Render Results
  resultView.render(model.getSearchResultPage(goToPage));
  paginationView.render(model.state.search);
};

/**
 * Controller: Update servings for the current recipe
 * Flow:
 * - Mutates ingredient quantities in model based on target servings
 * - Updates recipe view with minimal DOM changes
 * Called by: `recipieView.addHandlerUpdateServings`
 */
const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

/**
 * Controller: Toggle bookmark for current recipe
 * Flow:
 * - Adds/removes from model bookmarks
 * - Updates current recipe bookmark icon and re-renders bookmarks list
 * Called by: `recipieView.addHandlerAddBookmark`
 */
const controlAddBookmark = function () {
  //1- Add/Reomve a Bookmark
  if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  else model.addBookmark(model.state.recipe);

  // 2- Display Bookmark
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Controller: Render persisted bookmarks on initial load
 * Called by: `bookmarksView.addHandlerRender` on window `load`
 */
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Controller: Handle new recipe upload
 * Flow:
 * - Show upload spinner
 * - Ask model to upload (POST) recipe to API (includes `KEY`)
 * - Render the new recipe, show success message, update bookmarks
 * - Update URL with new recipe id and close modal
 * Called by: `addRecipeView.addHandlerUpload`
 */
const controlAddRecipe = async function (x) {
  try {
    addRecipeView.spinner();

    await model.uploadRecipe(x);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 2000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error);
  }
};

/**
 * App entrypoint
 * - Subscribes controller handlers to view events
 * - Initializes bookmarks from localStorage via `model.js`
 */
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  paginationView.addHandlerClick(controlPagination);
};

init();
