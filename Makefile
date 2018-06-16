YARN = yarn -s
SUPPRESS = >/dev/null
MAKEFLAGS += -s

# Server modes
RUN = NODE_ENV=production $(YARN) start
DEV = $(YARN) start-dev

# Logging levels for the modes
MAX_LOG = DEBUG=* NODE_OPTIONS='--trace-sync-io'
PROD_LOG = DEBUG=server,error DEBUG_COLORS=0 DEBUG_SHOW_TIMESTAMP=0

# Append PIPE to any of the actions below to pipe server output to a log file
PIPE = 2>"logs/`date "+%Y-%m-%d %H:%M:%S"`.log"

.PHONY: dev v prod clean clear test

dev:
	$(DEV)

# verbose
v:
	$(MAX_LOG) $(DEV)

# Heroku already timestamps its logs
prod:
	$(PROD_LOG) $(RUN) $(PIPE)

clean:
	echo FLUSHALL | redis-cli $(SUPPRESS)
	mongo todo --eval "db.dropDatabase()" $(SUPPRESS)
	rm -rf .nyc_output $(SUPPRESS)

# clears logs
clear:
	rm -f logs/*.log

test:
	$(YARN) test

fake: clean
	$(YARN) fake

bench: fake
	$(YARN) bench