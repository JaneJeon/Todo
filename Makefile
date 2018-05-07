USER = $(shell whoami)
RUN = PORT=3000 \
	SECRET=$(SECRET_KEY) \
	REDIS_URL=redis://localhost:6379 \
	DATABASE_URL=postgres://$(USER)@localhost:5432/todo \
	node --optimize_for_size --max_old_space_size=460 --gc_interval=100 app.js

.PHONY: dev verbose run clean

dev:
	DEBUG=server,http,error NODE_ENV=development $(RUN)

verbose:
	DEBUG=* NODE_ENV=development $(RUN)

# Heroku already timestamps its logs
prod:
	DEBUG=server,http,error DEBUG_HIDE_DATE=1 NODE_ENV=production $(RUN) 2>&1 \
	| tee "logs/`date "+%Y-%m-%d %H:%M:%S"`.log"

clean:
	echo FLUSHALL | redis-cli
	psql -U $(USER) -d todo -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'