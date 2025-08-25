/**
 * Bookmarks View
 * - Renders the list of bookmarked recipes
 * - Subscribes to `load` to show persisted bookmarks on startup
 */
import View from './view';
import previewView from './previewView';
class bookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No Bookmarks Yet';
  _message = ' ';

  /** Allow controller to re-render bookmarks on page load */
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  /** Build markup by delegating each bookmark to `previewView` */
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new bookmarksView();
