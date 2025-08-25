/**
 * Preview View
 * - Produces the small list-item markup used in results and bookmarks
 * - Does not render directly; returns markup string consumed by parent views
 *
 * Relationships
 * - Extended from `View`
 * - Used by `resultView` and `bookmarksView`
 */
import View from './view';

class PreviewView extends View {
  _parentElement = '';

  /** Build the compact preview list item markup */
  _generateMarkup() {
    const id = window.location.hash.slice(1);

    return `<li class="preview">
              <a class="preview__link ${
                id === this._data.id ? 'preview__link--active' : ' '
              }" href="#${this._data.id}">
                <figure class="preview__fig">
                  <img src="  ${this._data.image}" alt="Test" />
                </figure>
                <div class="preview__data">
                  <h4 class="preview__title">${this._data.title}</h4>
                  <p class="preview__publisher">${this._data.publisher}</p>
                  <div class="preview__user-generated">
                    <svg>
                      <use href="src/img/icons.svg#icon-user"></use>
                    </svg>
                  </div>
                </div>
              </a>
            </li>`;
  }
}

export default new PreviewView();
