.PHONY: help install html serve clean
.DEFAULT_GOAL := help

help:
	@grep ": ##" Makefile | grep -v grep | tr -d '#'

install: ## Install Node dependencies (mystmd)
	npm install

html: ## Build MyST site in ./_build/html
html: install
	npx myst build --html

serve: ## Serve MyST site locally (live reload)
serve: install
	npx myst start

clean: ## Remove built files
clean:
	rm -rf _build
