in this example of webpack-postcss-tools:

- each file is a separate webpack module
- files are concatenated into a single `index.css` file

this approach has a bit slower build than the `individual-style-elements`
approach, but it generally facilitates faster page loads.

you can try this build out by running `npm install && npm run dev` from this
directory. this will start a dev server at
[http://localhost:8080](http://localhost:8080).

