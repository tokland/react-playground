Demo Playground React app to explore best practices.

## Setup

`$ yarn install`

Run in development mode:

`$ yarn start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Libraries

### State management

Custom: State + Actions + useStoreState (efficient subscription to the store via function selectors)

### Cancelable async effects

https://github.com/srmagura/real-cancellable-promise
Async

### Routing

Custom:

-   Declarative route definition (using an agnostic object, not a React component)
-   URL is derived from the App state.
-   The router renders some component derived from the App state.
-   You normally do not generate explicit routes from the app (you change the state and the URL updated accordingly), but when you need build a link, an example: `const path = getPathFromRoute(routes, { type: "counter", id: "c1" })`

### Data structures

Immutable data structures with @rimbu

### Internationalization (i18n)

### Testing

if it's necessary to

#### Unit testing

Jest + react-testing-library

#### Functional tests

Playwright

### Code quality

`$ yarn lint`

-   Duplicated code: ????
-   Unused code: ts-prune
