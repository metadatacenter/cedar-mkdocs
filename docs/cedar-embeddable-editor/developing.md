# Building the CEE from Source

The published package is all an application needs in order to embed the CEE. Two situations call for
the source instead: changing the editor itself, and trying an unreleased build inside an application
before it ships.

The CEE is a standalone Angular project. It does not need a CEDAR installation, and none of its
build or test commands depends on the CEDAR microservices.

## Prerequisites

The CEE builds, runs and tests on **Node 24.19.0**, one version for all three. It is named in
`.nvmrc`, declared in `engines`, and pinned in continuous integration. A Node outside Angular's
supported range fails in ways that read as unrelated breakage, so check `node -v` before
investigating anything else.

Installing it keg-only keeps it out of the way of the Node other CEDAR frontends use:

```shell
brew install node@24
export PATH="$(brew --prefix)/opt/node@24/bin:$PATH"
```

Nothing else is required. In particular, no sibling checkout is needed: the CEE resolves the CEDAR
model library from the Stanford BMIR Nexus registry as an ordinary npm dependency, and reading from
that registry needs no credentials. An `.npmrc` beside each manifest maps the
`@org.metadatacenter` scope to Nexus; every other dependency comes from npmjs.org.

## Getting the Code

```shell
git clone https://github.com/metadatacenter/cedar-embeddable-editor.git
cd cedar-embeddable-editor
npm install
```

Work lands on `develop`. `main` is owned by the release process.

## Running the Standalone Application

```shell
npm start
```

Then open `http://localhost:4400/`. The application reloads as source files change.

The standalone application loads a sample template and a matching instance from
`src/assets/cee-demo/demo`, so it starts from this repository alone with nothing else running. Its
configuration is `src/app/app.component.dev.ts`, which is TypeScript compiled into the build rather
than a JSON file read at run time. Editing it is how a developer points the standalone application
at a local terminology service, a different sample template, or a different set of panels.

## Running the Tests

One command runs everything, in order, stopping at the first failure:

```shell
npm run test:ci
```

Its stages are worth knowing individually, because each answers a different question:

1. **Lint**, over the sources and the configuration.
2. **A type check** of the application and the test harness, with `strict` on throughout.
3. **Unit tests**, in Node under Vitest. None of them starts a browser, which is why the layer runs
   in about a second.
4. **The domain harness**, with coverage thresholds enforced per directory. This is the large suite:
   it exercises the parsers, the handlers and the instance builder against a vendored corpus of real
   templates, and it checks the CEE's output against the templates it came from.
5. **A production build** of the web component, followed by **the Playwright suite** against it. The
   suite renders fixture templates at desktop and narrow viewport sizes and compares them to
   committed screenshots, and it asserts behavior that an image cannot describe, such as whether
   clicking a term suggestion keeps the term.
6. **Staging the npm package** from the exact bundle the suite exercised, then verifying every
   staged byte against its source.

The test corpora are vendored in the repository, so no additional checkouts are needed.

Before the first run, install the dependencies of the two nested projects and the browser binaries
Playwright drives:

```shell
npm ci
npm --prefix harness ci
npm --prefix visual ci
./visual/node_modules/.bin/playwright install chromium firefox webkit
```

While working on one layer, the focused commands give faster feedback:

```shell
npm run test:unit:ci          # unit tests, one run
npm run test:domain           # the domain harness
npm run test:domain:coverage  # the same, with a coverage report
npm run test:visual           # build, prepare fixtures, run Playwright
npm run test:bundle-size      # the raw and gzip budgets for the shipped bundle
```

`npm test` runs the unit tests once, and `npm run test:watch` keeps them running interactively.

Continuous integration runs the same gate on every pull request, and on pushes to `main` and
`develop`. Nothing is published from it.

## Building the Web Component

The deliverable is one JavaScript file. Build it, then exercise it:

```shell
npm run build:production
npm run test:visual:prebuilt
```

Do not assemble the output by hand. Angular's builders change which files they emit and how those
files are scoped, and a hand-written concatenation that was right for one builder produces a
truncated or subtly broken bundle under the next, without failing. The repository's own packaging
step decides what the build emitted and how to combine it.

Once that bundle is green, stage the publishable directory from it:

```shell
npm run package:npm:prebuilt
```

This copies the tested bytes to `dist-npm/cedar-embeddable-editor/`, refreshes the manifest, the
declarations, the README and the changelog, and records the bundle's digest. It refuses to run if
the bundle is stale or does not match its recorded SHA-256, which is what guarantees that the bytes
published are the bytes a browser exercised. `npm run check:npm-package` repeats that verification
on demand.

## Auditing What Ships

```shell
npm run audit:prod
```

Only runtime dependencies reach the file an application downloads, so this is the audit that
describes the shipped artifact. A root `npm audit` reports advisories against the Angular build
toolchain, which is a hazard to a developer's machine rather than to a consumer, and `npm audit fix
--force` on this repository proposes walking that toolchain years backwards. Read the advisory
instead.

## Further Reading

The repository's own `README.md` is the reference for the host contract and the package layout, and
`CHANGELOG.md` records what changed in each release. The public API a host programs against is a
single source file, `src/app/cee-public-api.ts`, which is also what the shipped declarations are
generated from, and reading it is the fastest way to see the whole surface at once.
