# Test Cases — User Profile

> Test case list for the user-profile feature. Cases are implemented one by one
> following the TDD cycle (Red → Green → Refactor).

## Domain: `displayName(user)`

Pure function over the `User` model. The demo profile arrives from the "API" in
snake_case; the domain speaks camelCase.

| TC ID | Scenario | Input | Expected Result |
|---|---|---|---|
| UP-01 | Compose the full name | `{ firstName: 'Dilan', lastName: 'Morgan', … }` | `'Dilan Morgan'` |

## Use Case: `getUser(repo)`

Application service over `UserRepository`. The repository resolves the demo
profile with its original 450ms simulation delay.

| TC ID | Scenario | Precondition | Expected Result |
|---|---|---|---|
| UP-02 | Fetch the demo user | Mock repo returns the Dilan Morgan profile | Returns the camelCase `User` including `walletBalance: 1050` |

## Controller: `getUserController()`

Wires the registry (InMemory repository) to the use case.

| TC ID | Scenario | Expected Result |
|---|---|---|
| UP-03 | Resolve via registry | Same profile as UP-02, including `email: 'dilan.1995@email.com'` and `membership: 'Orbit Plus'` |

### Execution notes

- UP-01 → cycle 1 (domain happy path).
- UP-02 → cycle 2 (use case + snake_case → camelCase mapping in infrastructure).
- UP-03 → cycle 3 (composition wiring).
