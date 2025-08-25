/**
 * Search View
 * - Manages the search form: reads query and forwards to controller
 * - Disables the submit button during async operations
 */
class SearchView {
  #element = document.querySelector('.search');
  #renderElement = document.querySelector('.search-results');
  /** Clear the search input field */
  #clearInput() {
    this.#element.querySelector('.search__field').value = '';
  }
  /** Clear results container (not used here but available) */
  #clearResults() {
    this.#renderElement.innerHTML = '';
  }

  /** Read query string and clear input */
  getQuery() {
    let x = this.#element.querySelector('.search__field').value;
    this.#clearInput();
    return x;
  }

  /** Allow controller to handle the form submit */
  addHandlerSearch(functionNametoBeCalled) {
    this.#element.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = e.target.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;

      // Call the handler
      functionNametoBeCalled().finally(() => {
        // Re-enable button after async work finishes
        if (btn) btn.disabled = false;
      });
    });
  }

  // addHandlerDisplayClickedSearch(handler) {
  //   let x = this.#element.querySelector('.preview');
  //   x.addEventListener('click', function (e) {
  //     e.preventDefault();
  //     const link = e.target.closest('a');
  //     if (!link) return; // Click wasn't on or inside an <a>

  //     const href = link.getAttribute('href');
  //     handler(href);
  //   });
  // }
}

export default new SearchView();
