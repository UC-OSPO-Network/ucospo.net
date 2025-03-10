.PHONY: help prepare html serve clean
.DEFAULT_GOAL := help

help:
	@grep ": ##" Makefile | grep -v grep | tr -d '#'

prepare:
	git submodule update --init --recursive
	hugo version || echo "Install Hugo from: https://gohugo.io"
	((python -c 'import yaml2ics') > /dev/null 2>&1) || pip install -q -r requirements.txt

CALENDAR_DIR = content/calendars

$(CALENDAR_DIR):
	mkdir -p $(CALENDAR_DIR)

$(CALENDAR_DIR)/%.ics: calendars/%.yaml $(CALENDAR_DIR)
	yaml2ics $< > $@

CALENDAR_SOURCES = $(wildcard calendars/*.yaml)
calendars: $(subst calendars,$(CALENDAR_DIR),$(CALENDAR_SOURCES:.yaml=.ics))

html: ## Build site in `./public`
html: prepare
	hugo

serve: ## Serve site, typically on http://localhost:1313
serve: prepare
	@hugo --printI18nWarnings server

clean: ## Remove built files
clean:
	rm -rf public
