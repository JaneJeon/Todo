# Server modes
RUN = NODE_ENV=production yarn start
DEV = yarn start-dev

# Logging levels for the modes
DEV_LOG = DEBUG=server,req:,error
MAX_LOG = DEBUG=* NODE_OPTIONS='--trace-sync-io'
PROD_LOG = DEBUG=server,error DEBUG_COLORS=0

# Append PIPE to any of the actions below to pipe server output to a log file
DATE = `date "+%Y-%m-%d %H:%M:%S"`
PIPE = 2>"log/$(DATE).log"

# A gzip bomb that will expand to a 10 gig file once extracted
BOMB = public/assets/10G.gzip
ifeq ($(shell uname -s), Linux)
BS = 1M
else
BS = 1m
endif

.PHONY: dev v prod clean clear test bomb

dev:
	$(DEV_LOG) $(DEV)

# verbose
v:
	$(MAX_LOG) $(DEV)

# Heroku already timestamps its logs
prod:
	$(PROD_LOG) $(RUN) $(PIPE)

clean:
	echo FLUSHALL | redis-cli
	mongo todo --eval "db.dropDatabase()"
	rm -rf .nyc_output

# clears logs
clear:
	rm -f logs/*.log

test:
	yarn test

fake: clean
	DEBUG=fake* yarn fake

bench: fake
	DEBUG=benchmark* yarn bench >log/item-bench-$(DATE).log

# make ZIP bomb
bomb:
	dd if=/dev/zero bs=$(BS) count=10240 | gzip > $(BOMB)