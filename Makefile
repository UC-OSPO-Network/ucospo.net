.PHONY: help install html serve clean lint a11y test check
.DEFAULT_GOAL := help

help:
	@grep ": ##" Makefile | grep -v grep | tr -d '#'

install: ## Install Node dependencies (mystmd)
	npm ci

html: ## Build MyST site in ./_build/html
html: install
	npx myst build --html
	node scripts/generate-feed.js
	node scripts/aggregate-events.js

serve: ## Serve MyST site locally (live reload)
serve: install
	npx myst start

lint: ## Check for broken links in the built site
lint: html
	npx linkinator ./_build/html/ --skip /events-embed.html

# Accessibility. The embed (/events-embed.html) is not in the sitemap, so it is
# audited separately below with `pa11y`. FullCalendar ARIA table markup issues and
# contrast are resolved directly in embed.html.
a11y: ## Run accessibility checks against the built site
a11y: html
	npx serve _build/html -p 4117 & \
	SERVER_PID=$$!; \
	trap "kill $$SERVER_PID" EXIT; \
	timeout 30 bash -c 'until curl -s http://localhost:4117 > /dev/null; do sleep 1; done'; \
	npx pa11y-ci --sitemap http://localhost:4117/sitemap.xml \
		--sitemap-find 'http://localhost:[0-9]+' \
		--sitemap-replace 'http://localhost:4117' && \
	npx pa11y --standard WCAG2AA \
		http://localhost:4117/events-embed.html

test: ## Run unit tests (no build needed)
test: install
	npm test

check: ## Run unit tests + full build + lint + accessibility (same as CI)
check: test lint a11y

clean: ## Remove built files
clean:
	rm -rf _build
