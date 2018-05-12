# Hierarchical Todo's & Notes
## Running the Todo Server
If you're in a hurry, after making sure you have local instances of `Redis` and `Postgres` running, run `yarn start` to run the server, `yarn start-dev` to run it through `Nodemon`, and `yarn test` to run the tests (with coverage).

As all of the logging statements are pushed through `debug`, you'll need to specify which debug statements you want to see through the `DEBUG` environment variable if you want to see server logs.

e.g. `DEBUG=* yarn start`

However, the recommended way to run the server is through `Make`, as the environment variables have been preconfigured for various "modes" (see below) and allows you to easily tweak them (specifically, by overriding the `ENV` alias in `Makefile`).

Run `make` to boot the server in development mode, `make v` for verbose mode (in which ALL `debug` statements and any sync I/O is printed out), `make prod` for something akin to what you'd see in a production environment (specifically, Heroku), `make clean` to wipe the slate of the datastores, which is useful for `make test`.

Regardless of how you run the server, all of the environment variables (many of which you don't have to touch *at all*) are documented in the `Makefile`, along with their (sane) default values (which is what allows the server to run with zero configuation).

## Supported Datastores
For session storage, the default option is to use `Redis`. However, you can override it from `app.js` (and use in-memory storage, for example). The server is database-agnostic (ie. it doesn't matter if it's `MySQL`, `Postgres`, or `SQLite`) as long as you pass in a valid connection URL (and install the drivers used by `Sequelize`).