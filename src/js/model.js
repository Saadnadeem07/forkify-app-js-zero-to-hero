/**
 * Data Model
 * - Holds application state and encapsulates all data fetching/mutations
 * - Communicates with the Forkify API via `AJAX` helper
 * - Exposes pure functions for the controller to call
 *
 * Relationships
 * - Imports constants from `config.js` (API_URL, RES_PER_PAGE, KEY)
 * - Uses `AJAX` from `helper.js` to GET/POST data
 * - Consumed by `controller.js` to drive the UI
 */
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { AJAX } from './helper';
import sampleData from '../../public/data.json'; // or wherever your file is
import jsonFile1 from '../../public/R1.json';
import jsonFile2 from '../../public/R2.json';
import jsonFile3 from '../../public/R3.json';
export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

/**
 * Normalize API recipe payload into internal shape used by views
 * Input: full API response `{ data: { recipe: {...} } }`
 * Output: flat recipe object with consistent property names
 */
const createRecipeObject = function (data) {
  let recipe = data.data.recipe;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    source: recipe.source_url,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    time: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * Load a single recipe by id
 * Flow:
 * - Compose API URL with id and `KEY`
 * - Fetch via `AJAX`, normalize, store in `state.recipe`
 * - Mirror bookmark status onto the recipe object
 * Called by: `controller.controlRecipes`
 */
export const loadRecipe = async function (id) {
  try {
    //========================= local setup =========================

    // // let data;
    // if (id === '664c8f193e7aa067e94e8297') data = jsonFile1;
    // else if (id === '664c8f193e7aa067e94e897b') data = jsonFile2;
    // else data = jsonFile3;

    //========================= local setup =========================

    let url = `${API_URL}${id}?key=${KEY}`;
    let data = await AJAX(url);
    console.log(`first =  ${data}`);
    state.recipe = createRecipeObject(data);
    console.log(`state.recipe  = ${state.recipe}`);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (error) {
    console.error(`An error catched in modeljs ${error}`);
    throw error;
  }
};

/**
 * Execute a search query and store results
 * Flow:
 * - Persist query in `state.search.query`
 * - Fetch results with `KEY`, map to lightweight objects for list views
 * - Reset pagination to first page
 * Called by: `controller.controlSearchResults`
 */
export const loadSearchResults = async function (query) {
  try {
    // //local
    // let data = sampleData; // pretend like this is the API response
    // //end
    // ////// add data. below

    state.search.query = query;
    console.log(query);
    //-------online testing
    let url = `${API_URL}?search=${query}&key=${KEY}`;
    console.log(url);
    let data = await AJAX(url);
    //--------- end
    state.search.result = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        source: recipe.source_url,
        image: recipe.image_url,
      };
    });
    state.search.page = 1;

    // console.log('state.search.result', state.search.result);
  } catch (error) {
    //throwing error
    throw error;
  }
};

/**
 * Get a slice of search results for a given page
 * Input: target page (defaults to current in state)
 * Output: results array for the page
 * Called by: `controller` when rendering results and paginating
 */
export const getSearchResultPage = function (pageNumber = state.search.page) {
  state.search.page = pageNumber;
  let start = (pageNumber - 1) * state.search.resultsPerPage;
  let end = pageNumber * state.search.resultsPerPage;
  // console.log(start, end, pageNumber, state.search.resultsPerPage);
  // console.log(state.search.result.slice(start, end));
  return state.search.result.slice(start, end);
};

/**
 * Update ingredient quantities when servings change
 * Input: new servings count
 * Side effects: mutates `state.recipe.ingredients` and `state.recipe.servings`
 * Called by: `controller.controlServings`
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

/**
 * Add recipe to bookmarks and persist to localStorage
 * Called by: `controller.controlAddBookmark`
 */
export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

/**
 * Remove recipe from bookmarks by id and persist
 * Called by: `controller.controlAddBookmark`
 */
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(x => x.id === id);

  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

/**
 * Persist bookmarks to localStorage
 */
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/**
 * Initialize bookmarks from localStorage
 * Called implicitly on module load (via `init()` if used)
 */
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

/**
 * Helper to clear bookmarks (debug)
 */
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

/**
 * Upload a new recipe to the API
 * Flow:
 * - Parse and validate dynamic ingredient fields
 * - Build API payload in expected format
 * - POST via `AJAX` with `KEY`, normalize response, store in state
 * - Auto-bookmark the uploaded recipe
 * Called by: `controller.controlAddRecipe` via `addRecipeView`
 */
export const uploadRecipe = async function (recipe_obj) {
  try {
    const ingredients = Object.entries(recipe_obj)
      .filter(e => e[0].startsWith('ingredient') && e[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', ' ').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Please input all fields like in this format  1,kg,apple'
          );

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: recipe_obj.title,
      publisher: recipe_obj.publisher,
      source_url: recipe_obj.sourceUrl,
      image_url: recipe_obj.image,
      servings: recipe_obj.servings,
      cooking_time: recipe_obj.cookingTime,
      //ingredients: recipe_obj.ingredients, /,or use below one
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
