this a basic example of the webpack-postcss-tools:

- each file is a separate webpack module
- each file ends up on the page as a separate `<style>` element
- there are some empty `<style>` elements because of css files that only
  contain `@import` statements

this approach is nicer for development since the build is relatively fast, but
the page will tend to load slower than if the css was all combined into a
single `<link>` element.

you can try this build out by running `npm install && npm run dev` from this
directory. this will start a dev server at
[http://localhost:8080](http://localhost:8080).
