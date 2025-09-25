# 🍴 Forkify -- JavaScript Zero-to-Hero Project

A **recipe search and management web application** built while
following\
[Jonas Schmedtmann's "The Complete JavaScript
Course"](https://www.udemy.com/course/the-complete-javascript-course/).\
This fork is my own implementation to practice **modern JavaScript
(ES6+)**, MVC architecture, and production-ready build tools.

------------------------------------------------------------------------

## 📂 Directory Structure

    saadnadeem07-forkify-app-js-zero-to-hero/
    ├── README.md
    ├── index.html
    ├── package.json
    ├── .prettierrc
    ├── public/
    │   ├── data.json
    │   ├── R1.json
    │   ├── R2.json
    │   └── R3.json
    └── src/
        ├── js/
        │   ├── config.js
        │   ├── controller.js
        │   ├── helper.js
        │   ├── model.js
        │   └── views/
        │       ├── addRecipeView.js
        │       ├── bookmarksView.js
        │       ├── paginationView.js
        │       ├── previewView.js
        │       ├── recipieView.js
        │       ├── resultView.js
        │       ├── searchView.js
        │       └── view.js
        └── sass/
            ├── _base.scss
            ├── _components.scss
            ├── _header.scss
            ├── _preview.scss
            ├── _recipe.scss
            ├── _searchResults.scss
            ├── _upload.scss
            └── main.scss

------------------------------------------------------------------------

## ✨ Features

-   **Recipe Search** -- Query thousands of recipes via the [Forkify
    API](https://forkify-api.herokuapp.com/).\
-   **Detailed Recipe View** -- Ingredients, cooking time, and serving
    size.\
-   **Adjust Servings** -- Automatically recalculate ingredient
    quantities.\
-   **Bookmarks** -- Save favorite recipes in local storage.\
-   **Add Your Own Recipes** -- Upload custom recipes that persist
    locally.\
-   **Responsive UI** -- Built with Sass and modular JavaScript.\
-   **MVC Architecture** -- Clean separation of model, view, and
    controller.

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **HTML5**, **Sass (SCSS)** -- Provided by the course starter files\
-   **Vanilla JavaScript (ES6+)** -- **All JavaScript functionality
    implemented entirely by me**\
-   **Parcel** as the development build tool and bundler

------------------------------------------------------------------------

## 🚀 Getting Started

### Prerequisites

-   **Node.js** v14+\
-   **npm** (bundled with Node)

### Installation

``` bash
# 1. Clone the repository
git clone https://github.com/<your-username>/saadnadeem07-forkify-app-js-zero-to-hero.git
cd saadnadeem07-forkify-app-js-zero-to-hero

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will be available at **http://localhost:1234**.

------------------------------------------------------------------------

## 🌐 Deployment

You can deploy this project on any static hosting platform such as
**Netlify**, **Vercel**, or **GitHub Pages**.\
*(Optional: Add your live link once deployed.)*

------------------------------------------------------------------------

## 🙏 Acknowledgments

-   Original concept and design by **[Jonas
    Schmedtmann](https://codingheroes.io/)**\
-   HTML/CSS/Sass starter files provided as part of the course.\
-   **All JavaScript code written by me** to implement the full
    functionality.

------------------------------------------------------------------------

## 📜 License

This project is for **educational purposes only**.\
Feel free to fork and modify, but please credit the original author.

------------------------------------------------------------------------

### 🔗 Live Demo (if available)

    [https://your--link.netlify.app/](https://saad-forkify-app-js.netlify.app/)
