/**
 * Results View
 * - Renders a list of search results using `previewView`
 * - Consumed by `controller.js` after a search is performed
 */
import View from './view';
import previewView from './previewView';
class resultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query';
  _message = ' ';
  /** Build markup by delegating each item to `previewView` (no immediate render) */
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultView();
