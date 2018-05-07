USER = $(shell whoami)

ENV = PORT=3000 \
	SECRET=$(SECRET_KEY) \
	REDIS_URL=redis://localhost:6379 \
	DATABASE_URL=postgres://$(USER)@localhost:5432/todo \
	SSL=0
MIN_LOG = DEBUG=server,http,error
MAX_LOG = DEBUG=*
DEV = NODE_ENV=development
PROD = NODE_ENV=production

WARN_SYNC = --trace-sync-io
RUN = $(ENV) node --optimize_for_size --max_old_space_size=460 --gc_interval=100 app.js

.PHONY: dev verbose run clean cluster

dev:
	$(MIN_LOG) $(DEV) $(RUN)

verbose:
	$(MAX_LOG) $(DEV) $(RUN) $(WARN_SYNC)

# Heroku already timestamps its logs
prod:
	$(MIN_LOG) DEBUG_HIDE_DATE=1 $(PROD) $(RUN) 2>&1 \
	| tee "logs/`date "+%Y-%m-%d %H:%M:%S"`.log"

clean:
	echo FLUSHALL | redis-cli
	psql -U $(USER) -d todo -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'
	pm2 flush

test: clean
	$(ENV) $(DEV) yarn test

cluster:
	$(ENV) $(MIN_LOG) $(PROD) yarn start -i max

log:
	pm2 logs app

stop:
	pm2 delete app