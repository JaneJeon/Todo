# Hierarchical Todo's & Notes
## Running the Todo Server
If you're in a hurry, make sure you have `Redis` and `Postgres` running, and create a `todo` database on `Postgres`. Then, run `yarn start` to run the server, `yarn start-dev` to run it through `Nodemon`, and `yarn test` to run the tests (with coverage).

You can see the default environment variables and their descriptions on the `.env` file. From there, you can modify the environment variables how you see fit.

A `Makefile` is also provided for various "modes", which you might find handy. Run `make` to boot the server in development mode, `make v` for verbose mode (in which ALL `debug` statements and any sync I/O is printed out), `make prod` for something akin to what you'd see in a production environment (specifically, Heroku), `make clean` to wipe the slate of the datastores, which is useful for `make test`. If you're piping server output to a log file, `make clear` to clear the logfiles.

## Supported Datastores
For session storage, the default option is to use `Redis`. However, you can override it from `app.js` (and use in-memory storage, for example). The server is database-agnostic (ie. it doesn't matter if it's `MySQL`, `Postgres`, or `SQLite`) as long as you pass in a valid connection URL (and install the drivers used by `Sequelize`).

## Access Codes
Access levels are logged for POST requests to `/login` and `/register`, with the path + access combination indicating the following:
- `/login 1`:
	- User logged in successfully with existing credentials.
- `/register 1`:
	- User created an account successfully.
- `/login -1`:
	- User tried to login with faulty credentials.
- `/register -1`:
	- User failed to create an account due to it clashing with an existing account.

This way, you can keep an eye on brute force attacks and account registeration rate just by looking at the server logs.