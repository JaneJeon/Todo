# Hierarchical Todo's & Notes
## Running the Todo Server
If you're in a hurry, make sure you have `Redis` and `MongoDB` running. Then, run `yarn start` to run the server, `yarn start-dev` to run it through `Nodemon`, and `yarn test` to run the tests (with coverage).

You can see the default environment variables and their descriptions on the `.env` file. From there, you can configure the environment variables how you see fit.

A `Makefile` is also provided for various "modes", which you might find handy. Run `make` to boot the server in development mode, `make v` for verbose mode (in which ALL `debug` statements and any sync I/O is printed out), `make prod` for something akin to what you'd see in a production environment (specifically, Heroku), `make clean` to wipe the slate of the datastores, which is useful for `make test`. If you're piping server output to a log file, `make clear` to clear the logfiles.

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

## Models
### Goals
- Reflect the way objects are used in application (ie. eliminate impedence mismatch)
- Minimize the number of queries that need to run

### Functionality
A User:
- can create multiple collections
- can share those collections with certain people, or the public (unlisted)
- can watch multiple collections (unlisted)

A Collection:
- has one creator
- can have multiple collaborators on a private document
- can be private or unlisted

An Item:
- needs to be able to CRUD in-place by its `id`
- needs to be able to drag and drop subtrees
	- select the "head" of subtrees
	- drop that head into a child of *someone*

While I considered referencing the *parent*, I realized I cannot preserve the order in which items are put in, which is kinda crucial for an app like this. In addition, referencing the *child* makes it super easy to populate.

<!-- TODO: sanity checks for fields -->