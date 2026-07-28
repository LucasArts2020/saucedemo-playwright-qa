# SauceDemo Playwright QA Portfolio

End-to-end login test suite for [SauceDemo](https://www.saucedemo.com/), built with Playwright and TypeScript.

The project exercises positive, negative, boundary, usability, and session-security scenarios. Each test contains explicit assertions for the expected URL, interface state, or error message.

## Test results

Latest verified local execution:

```text
20 passed (50.3s)
Browser: Chromium
Workers: 1
```

## Test coverage

| ID | Scenario |
| --- | --- |
| LOGIN-001 | Log in with valid credentials |
| LOGIN-002 | Log in with an invalid password |
| LOGIN-003 | Submit both fields empty |
| LOGIN-004 | Log in with an invalid username |
| LOGIN-005 | Submit without a username |
| LOGIN-006 | Submit without a password |
| LOGIN-007 | Log in with a locked-out user |
| LOGIN-008 | Use an uppercase username |
| LOGIN-009 | Use an uppercase password |
| LOGIN-010 | Add spaces around the username |
| LOGIN-011 | Add spaces around the password |
| LOGIN-012 | Use special characters |
| LOGIN-013 | Use very long input values |
| LOGIN-014 | Submit the form with the Enter key |
| LOGIN-015 | Dismiss the login error message |
| LOGIN-016 | Verify password masking |
| LOGIN-017 | Log in successfully after an invalid attempt |
| LOGIN-018 | Verify that browser Back does not restore access after logout |
| LOGIN-019 | Attempt to access a protected route without authentication |
| LOGIN-020 | Refresh the products page after login |

## Technology stack

- Playwright Test
- TypeScript
- Node.js
- Chromium

## Requirements

- Node.js 18 or newer
- npm
- Internet access to reach SauceDemo

## Installation

Clone the repository and install the dependencies:

```bash
npm install
npx playwright install chromium
```

## Running the tests

Run the complete suite in headless mode:

```bash
npm test
```

Run with the browser visible:

```bash
npm run test:headed
```

Run with Playwright UI mode:

```bash
npm run test:ui
```

Open the HTML report:

```bash
npm run report
```

If PowerShell blocks the `npm.ps1` or `npx.ps1` wrappers, use `npm.cmd` and `npx.cmd` instead.

## Project structure

```text
.
|-- tests/
|   `-- login.spec.ts
|-- playwright.config.ts
|-- package.json
`-- README.md
```

## Test design

- Tests run against Chromium with a desktop browser profile.
- The suite runs sequentially to keep session-related scenarios isolated and predictable.
- Locators use SauceDemo's `data-test` attributes and semantic roles where appropriate.
- Screenshots, videos, and Playwright traces are retained when a test fails.
- An HTML report is generated after each execution.

## Quality rule

A test is marked as passed only after it has been executed and its actual result matches the expected behavior.
