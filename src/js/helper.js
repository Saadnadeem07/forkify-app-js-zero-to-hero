/**
 * Networking Helpers
 * - Provides a unified `AJAX` function for GET and POST requests
 * - Races fetch against a timeout exposed by `controller.js`
 *
 * Relationships
 * - Imports `timeout` from `controller.js` (note: introduces coupling)
 * - Imports `TIMEOUT_SEC` from `config.js`
 * - Used by `model.js` for all API communication
 */
import { timeout } from './controller';
import { TIMEOUT_SEC } from './config';

//GET JSON AND SEND JSON FUNCTIONS IN 1 FUNCTION
/**
 * AJAX
 * - If `uploadData` is provided, performs a POST with JSON body
 * - Otherwise performs a GET
 * - Races the request with `timeout(TIMEOUT_SEC)`
 * Params: url (string), uploadData (object | undefined)
 * Returns: parsed JSON from the response
 * Throws: Error when HTTP status is not ok
 * Called by: `model.loadRecipe`, `model.loadSearchResults`, `model.uploadRecipe`
 */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData //conditional if else
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    let res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    let data = await res.json();
    console.log(`res = ${res} data = ${data}`);

    if (!res.ok) {
      throw new Error(
        `Failed to fetch data from ${res.url} Status = ${res.ok} Error Code = ${res.status}`
      );
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// export const getJSON = async function (url) {
//   try {
//     let res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     let data = await res.json();
//     //let data = res;

//     if (!res.ok) {
//       throw new Error(
//         `Failed to fetch data from ${res.url} Status = ${res.ok} Error Code = ${res.status}`
//       );
//       console.log(
//         `Failed to fetch data from ${res.url} Status = ${res.ok} Error Code = ${res.status}`
//       );
//     }

//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });

//     let res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     let data = await res.json();
//     //let data = res;

//     if (!res.ok) {
//       throw new Error(
//         `Failed to fetch data from ${res.url} Status = ${res.ok} Error Code = ${res.status}`
//       );
//     }

//     return data;
//   } catch (error) {
//     throw error;
//   }
// };
