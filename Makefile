.PHONY: help themes html serve clean
.DEFAULT_GOAL := help

help:
	@grep ": ##" Makefile | grep -v grep | tr -d '#'

themes:
	git submodule update --init --recursive
	hugo version || echo "Install Hugo from: https://gohugo.io"

html: ## Build site in `./public`
html: themes
	hugo

serve: ## Serve site, typically on http://localhost:1313
serve: themes
	@hugo --printI18nWarnings server

clean: ## Remove built files
clean:
	rm -rf public

jbook-html: ## Build Jupyter Book site in jbook/_build/site
jbook-html:
	cd jbook && jupyter-book build --site

jbook-serve: ## Serve Jupyter Book locally (live reload)
jbook-serve:
	cd jbook && jupyter-book start
