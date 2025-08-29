# Vue Toastification Developer Instructions

Vue Toastification is a Vue 3 plugin/library for displaying toast notifications. It's built with TypeScript, uses Vite for building, Jest for testing, and includes both a library build and a demo application.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Prerequisites and Setup
- Install Node.js 20+ (repository includes .nvmrc with 20, minimum required)
- Install Yarn package manager: `npm install -g yarn`
- Clone and setup:
  ```bash
  git clone https://github.com/Maronato/vue-toastification.git
  cd vue-toastification
  yarn install --frozen-lockfile
  ```

### Build and Development Commands
**CRITICAL TIMING NOTES**: All commands below have been validated with actual timings. NEVER CANCEL these operations.

- **Install dependencies**: `yarn install --frozen-lockfile` -- takes ~31 seconds. NEVER CANCEL.
- **Run tests**: `yarn test` -- takes ~17 seconds (currently 213 tests, all passing). NEVER CANCEL. Set timeout to 60+ seconds.
- **Lint code**: `yarn lint` -- takes ~14 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- **Build library**: `yarn build` -- takes ~3 seconds. Produces `dist/index.es.js`, `dist/index.umd.js`, and `dist/index.css`.
- **Build demo**: `yarn build:demo` -- takes ~1.5 seconds. Creates demo build in `dist/`.
- **Full CI pipeline**: `yarn prepublishOnly` -- runs lint + test + build. All tests should pass. NEVER CANCEL. Set timeout to 60+ seconds.

### Development Workflow
- **Start demo server**: `yarn dev` -- runs on http://localhost:3000 (NOT 8080 as some docs suggest)
- **Watch tests**: `yarn test:watch` -- runs tests in watch mode for development
- **Format code**: Always run `yarn lint:fix` before committing
- **Lint staged files**: `yarn lint:staged` -- runs automatically via husky pre-commit hook

## Validation and Testing

### Manual Validation Requirements
**CRITICAL**: After making ANY changes to toast functionality, ALWAYS perform these validation steps:

1. **Start demo and test basic toast functionality**:
   ```bash
   yarn dev
   # Navigate to http://localhost:3000
   # Click "Show All Types" button
   # Verify toasts appear with different types (success, error, warning, info) and close buttons (×)
   # Verify toasts can be closed by clicking the × button
   ```

2. **Test different toast types** (if making changes to toast types):
   - Test success, error, warning, and info toasts
   - Verify correct icons and colors appear
   - Test toast positioning (top-left, top-right, bottom-left, bottom-right)

3. **Test programmatic controls** (if making changes to toast API):
   - Test creating toasts programmatically
   - Test updating toasts
   - Test dismissing toasts programmatically
   - Test clearing all toasts using "Clear All" button - should show "All toasts cleared!" message

4. **Test different animation types** (if making changes to animations):
   - Click individual animation buttons (Fade, Bounce, Scale, etc.) 
   - Verify animations play correctly
   - Test physics-based "Spring" animation

### Test Suite Validation
- **Run full test suite**: `yarn test` -- Currently 213 tests (all passing).
- **Test file structure**: Tests mirror `src/` structure under `tests/unit/`
- **Coverage requirements**: Target is 100% but currently ~67% due to incomplete test coverage
- **Snapshot tests**: UI changes will break snapshots. Ensure logic tests pass before updating snapshots.

### Lint and Build Validation
- **TypeScript validation**: `yarn lint:tsc` -- checks TypeScript types and compilation
- **ESLint validation**: `yarn lint:eslint .` -- checks code style and best practices  
- **Combined linting**: `yarn lint` -- runs both TypeScript and ESLint checks
- **Build validation**: `yarn build` -- must complete without errors and produce valid ES/UMD modules

## Repository Structure and Navigation

### Key Project Folders
```
├── src/                    # Main library source code
│   ├── components/         # Vue components (VtToast, VtIcon, VtProgressBar, etc.)
│   ├── scss/              # Styling files (variables, animations, themes)
│   ├── ts/                # TypeScript utilities and composables
│   ├── types/             # TypeScript type definitions
│   └── index.ts           # Main library entry point
├── demo/                  # Demo application source
│   ├── src/               # Demo Vue app
│   └── index.html         # Demo HTML template
├── tests/                 # Test files
│   ├── unit/              # Unit tests (mirrors src/ structure)
│   └── utils/             # Test utilities and helpers
├── dist/                  # Built library files (generated)
├── .github/workflows/     # CI/CD pipeline (runs Node 20, 22)
└── package.json           # Scripts and dependencies
```

### Important Files for Common Tasks
- **Plugin entry point**: `src/index.ts` -- main library exports
- **Main toast component**: `src/components/VtToast.vue` -- core toast functionality
- **Toast container**: `src/components/VtToastContainer.vue` -- handles positioning and management
- **Plugin configuration**: `src/ts/plugin.ts` -- Vue plugin setup and options
- **Type definitions**: `src/types/` -- TypeScript interfaces and types
- **Demo entry**: `demo/src/main.ts` -- demo application setup

### Frequently Modified Areas
- **Adding new toast types**: Modify `src/ts/constants.ts` and `src/components/VtIcon.vue`
- **Styling changes**: Update files in `src/scss/` directory
- **API changes**: Update `src/ts/interface.ts` and `src/ts/plugin.ts`
- **New features**: Add components to `src/components/` and tests to `tests/unit/components/`

## Configuration and Tools

### Build Configuration
- **Vite config**: `vite.config.ts` -- dual mode config for library and demo builds
- **TypeScript config**: `tsconfig.json` (main) and `tsconfig.build.json` (production builds)
- **Jest config**: `jest.config.js` -- test configuration with 100% coverage requirements

### Code Quality Tools
- **ESLint**: `.eslintrc.js` -- Vue 3, TypeScript, and Prettier integration
- **Prettier**: `.prettierrc` -- code formatting (no semicolons, avoid arrow parens)
- **Husky**: `.husky/pre-commit` -- runs `yarn lint-staged` before commits
- **Lint-staged**: Configured in `package.json` to run linting on staged files

### CI/CD Pipeline
- **Workflow**: `.github/workflows/cicd.yml` -- tests on Node 20, 22
- **Steps**: Install → Lint → Test → Build library → Build demo
- **Coverage**: Uploads to Codecov automatically

## Common Tasks and Troubleshooting

### When Adding New Features
1. **ALWAYS start with tests**: Create test file in `tests/unit/` matching `src/` structure
2. **Run tests first**: Ensure new test fails as expected
3. **Implement feature**: Make minimal changes to achieve passing tests
4. **Validate manually**: Use demo page to test new functionality
5. **Update types**: Add TypeScript types if needed in `src/types/`
6. **Run full validation**: `yarn lint && yarn test && yarn build` before committing to ensure all tests pass.

### When Fixing Bugs
1. **Write reproduction test**: Create failing test that reproduces the bug
2. **Run demo to confirm**: Verify bug exists in demo page
3. **Make minimal fix**: Change only what's necessary to pass tests
4. **Validate fix**: Test both automated tests and manual demo validation
5. **Check related areas**: Ensure fix doesn't break existing functionality

### Common Issues and Solutions
- **Port conflict**: Demo runs on port 3000, not 8080 as some docs suggest
- **Build warnings**: "named and default exports" warning is expected and can be ignored
- **Browserslist outdated**: Run `npx browserslist@latest --update-db` if needed
- **Test failures**: All tests should pass. If tests fail, investigate and fix the root cause.
- **Coverage failures**: Current coverage ~67%, not 100% - focus on testing new features thoroughly
- **Snapshot mismatches**: Review UI changes, then update snapshots if intentional

### Performance Expectations
- **Cold install**: ~31 seconds for `yarn install` from scratch
- **Incremental install**: ~5-10 seconds for small dependency changes
- **Test execution**: ~17 seconds for full test suite (213 tests, all passing)
- **Library build**: ~3 seconds for complete library build
- **Demo build**: ~1.5 seconds for demo application build
- **Lint checking**: ~14 seconds for full TypeScript + ESLint validation

**REMINDER**: These timings are actual measurements. NEVER CANCEL operations early - builds and tests may appear to hang but are working correctly.