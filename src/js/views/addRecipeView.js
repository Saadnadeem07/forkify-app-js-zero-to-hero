/**
 * Add Recipe View (Modal)
 * - Manages the upload form modal open/close and form submission
 * - Sends collected form data to the controller via handler
 *
 * Relationships
 * - Extends base `View`
 * - Used by `controller.controlAddRecipe`
 */
import View from './view';

class addRecipeView extends View {
  _overlay = document.querySelector('.overlay');
  _message = 'Recipe was successfully uploaded :)';
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');

  constructor() {
    super();
    this._addHandlerHideWindow();
    this._addHandlerShowWindow();
  }
  /** Toggle modal visibility */
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  /** Bind open button */
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  /** Bind close actions (button and overlay) */
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  /**
   * Allow controller to handle the form submission
   * - Collects form fields into an object and forwards it to the handler
   */
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
  _generateMarkup() {}
}

export default new addRecipeView();
