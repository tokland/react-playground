Demo Playground React app to explore best practices.

## Setup

`$ yarn install`

Run in development mode:

`$ yarn start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Libraries

### State management

Custom: State + Actions + useStoreState (effitient subscription to the store via selectors)

### Cancelable async effects

https://github.com/srmagura/real-cancellable-promise

### Routing

Custom:

-   URL from the app state.
-   Router definition.
-   Router renders component from the state.
-   You normally do not generate explicit routes from the app (you change the state and the URL updated accordingly), but if it's necessary to build a link, you can still generate them: `const urlPath = getPathFromRoute(routes, {type: "counter", id: "1"})`

### Data structures

Immutable @rimbu

### Testing

#### Unit testing

Jest + react-testing-library

#### Functional tests

Playwright

### Code quality

`$ yarn lint`

-   Duplicated code: ????
-   Unused code: ts-prune
