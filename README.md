# ucospo.net

The [UC OSPO Network](https://ucospo.net) website, built with [MyST](https://mystmd.org).

## CI and deployment

The site's production build is deployed to [GitHub Pages](https://pages.github.com) via GitHub Actions.

**On push to `main`:** `.github/workflows/deploy.yml` builds the site with `make html` and publishes it to the `UC-OSPO-Network.github.io` repo (also on a 12-hour schedule, to keep the aggregated event feeds current).

**On pull requests:** `.github/workflows/pr.yml` runs `make check`, and pre-commit.ci runs the pre-commit hooks. Branch PRs also get a **Netlify deploy preview** (built from `netlify.toml`, linked from the PR's checks); fork PRs get the checks but not the preview. The Netlify preview is not production. [CONTRIBUTING.md](CONTRIBUTING.md#run-the-checks) lists what each check catches.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for everything about working on the site: local setup, the project structure, content conventions, writing a blog post, and the PR review process.
