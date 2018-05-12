USER = $(shell whoami)
APP_NAME = app
APP = $(APP_NAME).js

# Set environment variables
# PORT: port number of the server (default 3000)
# SECRET: the secret key to be used for cookie & session storage (default 'teddie bear')
# REDIS_URL: the redis connection URL (default: redis://localhost:6379)
# DATABASE_URL: a SQL database connection URL (default: postgres://$(USER)@localhost:5432/todo)
# SSL: whether to use SSL in the database connection (default: 0)
ENV = 
MIN_LOG = DEBUG=server,http,error
MAX_LOG = DEBUG=* NODE_OPTIONS='--trace-sync-io'
PROD_LOG = $(MIN_LOG) DEBUG_HIDE_DATE=1

# Various log output levels
RUN = $(ENV) NODE_ENV=production yarn start
DEV = $(ENV) NODE_ENV=development yarn start-dev
TEST = $(ENV) yarn test

# Append this to any of the actions below to pipe server output to a log file
PIPE = | tee "logs/`date "+%Y-%m-%d %H:%M:%S"`.log"

# A gzip bomb that will expand to a 10 gig file once extracted
BOMB = public/assets/10G.gzip
ifeq ($(shell uname -s), Linux)
BS = 1M
else
BS = 1m
endif

.PHONY: dev v prod clean upgrade bomb

dev:
	$(MIN_LOG) $(DEV)

# verbose
v:
	$(MAX_LOG) $(DEV)

# Heroku already timestamps its logs
prod:
	$(PROD_LOG) $(RUN) $(PIPE)

clean:
	echo FLUSHALL | redis-cli
	psql -U $(USER) -d todo -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'
	rm -rf .nyc_output

test: clean
	$(TEST)

# make ZIP bomb
bomb:
	dd if=/dev/zero bs=$(BS) count=10240 | gzip > $(BOMB)