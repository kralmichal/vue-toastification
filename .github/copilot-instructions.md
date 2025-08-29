# Vue Toastification

Vue Toastification is a Vue 3 TypeScript library that provides beautiful and easy-to-use toast notifications. The project includes a library build system, comprehensive test suite, demo application, and full TypeScript support.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Setup
- Install dependencies: `yarn install --frozen-lockfile` -- takes 35 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- The project uses Node.js 14+ (specified in .nvmrc) but works with newer versions.
- Uses Yarn as the package manager with frozen lockfile for reproducible builds.

### Build Commands
- Build library: `yarn build` -- takes 3 seconds. Builds both library code and TypeScript declarations.
- Build demo: `yarn build:demo` -- takes 2 seconds. Creates production demo build.
- Clean build: `yarn prebuild` -- removes dist/ folder before building.

### Development Commands
- Start demo development server: `yarn dev` -- starts Vite dev server on http://localhost:3000
- Preview production demo: `yarn preview` -- serves built demo on port 3000

### Testing and Quality
- Run all tests: `yarn test` -- takes 18 seconds. NEVER CANCEL. Set timeout to 30+ minutes. Runs 201 tests with 100% code coverage requirement.
- Watch tests: `yarn test:watch` -- runs tests in watch mode for development.
- Lint code: `yarn lint` -- takes 15 seconds. NEVER CANCEL. Set timeout to 30+ minutes. Runs TypeScript check and ESLint.
- Lint and fix: `yarn lint:fix` -- automatically fixes linting issues.
- Staged linting: `yarn lint:staged` -- runs on pre-commit via Husky.

### Publishing
- Pre-publish checks: `yarn prepublishOnly` -- runs lint, test, and build before publishing.

## Validation

### Manual Testing Scenarios
Always manually validate toast functionality after making changes:
1. Start the demo: `yarn dev`
2. Navigate to http://localhost:3000
3. Verify the Vue logo and "Show toast" button are visible
4. Click "Show toast" button and verify a toast notification appears
5. Verify the toast has proper styling, close button, and disappears after timeout
6. Test different toast types if your changes affect them (success, error, warning, info)

### Build Validation
- Always run `yarn build` and verify dist/ folder contains:
  - `index.css` (~12KB) - Library styles
  - `index.es.js` (~34KB) - ES module build
  - `index.umd.js` (~18KB) - UMD build
  - `types/` folder - TypeScript declarations

### Test Coverage Requirements
- Maintain 100% code coverage on all metrics (branches, functions, lines, statements)
- All 201 tests must pass without failures
- Use Jest and Vue Test Utils for testing

## Project Structure

### Key Directories
- `src/` - Library source code
  - `components/` - Vue components (VtToast, VtToastContainer, VtIcon, etc.)
  - `ts/` - TypeScript utilities and composables
  - `types/` - TypeScript type definitions
  - `scss/` - Sass styling files
  - `index.ts` - Main library entry point
- `demo/` - Demo application source
- `tests/` - Jest unit tests with same structure as src/
- `dist/` - Build output (library and demo)
- `.github/workflows/cicd.yml` - CI/CD pipeline

### Important Files
- `package.json` - Project configuration and scripts
- `vite.config.ts` - Vite configuration for both library and demo builds
- `jest.config.js` - Jest testing configuration
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier code formatting

## Common Tasks

### Making Changes to Components
1. Edit files in `src/components/`
2. Run `yarn test:watch` to see test results in real-time
3. Update corresponding tests in `tests/unit/components/`
4. Verify demo functionality with `yarn dev`
5. Run `yarn lint` before committing

### Adding New Features
1. Create new component or utility in appropriate `src/` subfolder
2. Add comprehensive tests in `tests/unit/` matching src structure
3. Update types in `src/types/` if needed
4. Export from `src/index.ts` if public API
5. Test in demo application
6. Ensure 100% test coverage maintained

### Fixing Bugs
1. Create failing test that reproduces the bug
2. Fix the issue in source code
3. Verify test passes and coverage remains 100%
4. Test manually in demo application
5. Run full test suite and linting

## CI/CD Pipeline
The GitHub Actions workflow (.github/workflows/cicd.yml) runs on Node 14 and 16:
- Installs dependencies with Yarn
- Runs linting (yarn lint)
- Runs tests (yarn test) with Codecov upload
- Builds library (yarn build)
- Builds demo (yarn build:demo)

Always ensure your changes pass this pipeline by running the same commands locally.

## Development Tips
- The project uses Vue 3 Composition API extensively
- TypeScript strict mode is enabled - all code must be properly typed
- Prettier and ESLint are configured for consistent code formatting
- Husky runs lint-staged on pre-commit to catch issues early
- The demo application provides immediate feedback for testing changes
- Uses Vite for fast development and building
- SCSS is used for styling with CSS modules

## Frequently Used File Locations
- Main library entry: `src/index.ts`
- Toast component: `src/components/VtToast.vue`
- Container component: `src/components/VtToastContainer.vue`
- Core composables: `src/ts/composables/useToast.ts`
- Main types: `src/types/index.ts`
- Demo app entry: `demo/src/main.ts`
- Package configuration: `package.json`
- Vite config: `vite.config.ts`
- Jest config: `jest.config.js`

## Key Commands Reference
```bash
# Essential workflow commands (copy-paste ready):
yarn install --frozen-lockfile  # Install dependencies (35s)
yarn lint                       # Check code quality (15s)  
yarn test                       # Run all tests (18s)
yarn build                      # Build library (3s)
yarn dev                        # Start demo server
yarn build:demo                 # Build demo (2s)

# Development commands:
yarn test:watch                 # Watch mode for tests
yarn lint:fix                   # Auto-fix linting issues
yarn preview                    # Preview built demo
```

## Troubleshooting
- If builds fail, check TypeScript errors with `yarn lint:tsc`
- If tests fail, run `yarn test:watch` for detailed output and real-time feedback
- If demo doesn't work, check console errors in browser dev tools
- Clear node_modules and reinstall if dependency issues occur: `rm -rf node_modules && yarn install --frozen-lockfile`
- Ensure Node.js version matches .nvmrc (14+)
- Check Husky pre-commit hooks in `.husky/pre-commit` if commit issues occur
- Coverage failures: ensure all new code has corresponding tests with 100% coverage

## Git Workflow
- Pre-commit hook automatically runs `yarn lint-staged` via Husky
- Lint-staged runs TypeScript check and ESLint fix on changed files
- All changes must pass linting and maintain 100% test coverage
- Demo application should be manually tested after UI/component changes

## CRITICAL Timing Information
- **NEVER CANCEL** builds or tests - they may take up to 18 seconds for tests, 35 seconds for install
- Set timeouts appropriately: 60+ seconds for installs, 30+ minutes for tests/builds
- Demo startup is typically under 1 second once Vite pre-bundles dependencies
- Library builds complete in ~3 seconds
- Demo builds complete in ~2 seconds
- Full CI pipeline takes ~2-3 minutes per Node version (14, 16)
- First time `yarn dev` may take longer due to Vite dependency pre-bundling