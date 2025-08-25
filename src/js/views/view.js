/**
 * Base View Class
 * - Provides shared rendering utilities for all specific views
 * - Child classes must set `_parentElement` and implement `_generateMarkup()`
 *
 * Relationships
 * - Imported by all concrete views (recipe, results, bookmarks, etc.)
 */
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  /** Clear the target parent element before rendering */
  _clear() {
    this._parentElement.innerHTML = '';
  }
  /** Render a spinner into the parent element */
  spinner() {
    const html = `<div class="spinner">
        <svg>
        <use href="${icons}#icon-loader"></use>
        </svg>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  /**
   * Render data into the DOM
   * - If `render=false`, returns markup string instead (used by preview views)
   * - Handles empty data by delegating to `renderError`
   */
  render(data, render = true) {
    console.log(data, 'l');
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /** Render a success/info message */
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  /** Render an error message */
  renderError(errorMessage = this._errorMessage) {
    let errorHTML = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${errorMessage}</p>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', errorHTML);
  }
  /**
   * Efficiently update existing DOM to reflect `data`
   * - Creates a virtual DOM from new markup and diffs it against current DOM
   * - Updates changed text and attributes only
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //updates changed text

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      //updats changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
}
