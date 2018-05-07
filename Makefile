USER = $(shell whoami)
APP_NAME = app
APP = $(APP_NAME).js

ENV = PORT=3000 \
	SECRET=$(SECRET_KEY) \
	REDIS_URL=redis://localhost:6379 \
	DATABASE_URL=postgres://$(USER)@localhost:5432/todo \
	SSL=0
MIN_LOG = DEBUG=server,http,error
MAX_LOG = DEBUG=*
NO_LOG = $(MIN_LOG) DEBUG_HIDE_DATE=1
DEV = NODE_ENV=development
PROD = NODE_ENV=production

NODE_FLAG = --optimize_for_size --max_old_space_size=460 --gc_interval=100
WARN_SYNC = --trace-sync-io
PM2_FLAG = -i max
RUN = $(ENV) yarn $(NODE_FLAG) start
PIPE = 2>&1 | tee "logs/`date "+%Y-%m-%d %H:%M:%S"`.log"

.PHONY: dev v run clean cluster log stop

dev:
	$(MIN_LOG) $(DEV) $(RUN)

v:
	$(MAX_LOG) $(DEV) $(RUN) $(WARN_SYNC)

# Heroku already timestamps its logs
prod:
	$(NO_LOG) $(PROD) $(RUN) $(PIPE)

clean:
	echo FLUSHALL | redis-cli
	psql -U $(USER) -d todo -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'
	pm2 flush

test: clean
	$(ENV) $(DEV) yarn test

cluster:
	$(ENV) $(MIN_LOG) $(PROD) pm2 start $(APP) $(PM2_FLAG)

log:
	pm2 logs $(APP_NAME) -h

stop:
	pm2 delete $(APP_NAME)