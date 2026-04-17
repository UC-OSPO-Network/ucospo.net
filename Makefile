.PHONY: help install html serve clean lint a11y check
.DEFAULT_GOAL := help

help:
	@grep ": ##" Makefile | grep -v grep | tr -d '#'

install: ## Install Node dependencies (mystmd)
	npm ci

html: ## Build MyST site in ./_build/html
html: install
	npx myst build --html
	node scripts/generate-feed.js

serve: ## Serve MyST site locally (live reload)
serve: install
	npx myst start

lint: ## Check for broken links in the built site
lint: html
	npx linkinator ./_build/html/

a11y: ## Run accessibility checks against the built site
a11y: html
	npx serve _build/html -p 4117 & \
	SERVER_PID=$$!; \
	trap "kill $$SERVER_PID" EXIT; \
	timeout 30 bash -c 'until curl -s http://localhost:4117 > /dev/null; do sleep 1; done'; \
	npx pa11y-ci --sitemap http://localhost:4117/sitemap.xml \
		--sitemap-find 'http://localhost:[0-9]+' \
		--sitemap-replace 'http://localhost:4117'

check: ## Run full build + lint + accessibility (same as CI)
check: lint a11y

clean: ## Remove built files
clean:
	rm -rf _build
