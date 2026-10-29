# Test Cases — Product Catalog

> Test case list for the product-catalog feature. Cases are implemented one by one
> following the TDD cycle (Red → Green → Refactor).

## Domain: `filterByCategory(devices, category)` / `searchDevices(devices, query)` / `sortDevices(devices, sortBy)`

Pure functions over `Device[]`. Valid category filters: `All devices`, `Smartphones`,
`Tablets`. Search matches `name` OR `brand`, case-insensitive. Sort options:
`featured` (original order), `low` (price ascending), `high` (price descending).

### Test Cases

| TC ID | Scenario | Precondition | Input | Expected Result |
|---|---|---|---|---|
| PC-01 | Filter by a valid category | Fixtures contain 2 smartphones + 1 tablet | `category = 'Smartphones'` | Returns the 2 smartphones only |
| PC-02 | "All devices" keeps everything | Same fixtures | `category = 'All devices'` | Returns all devices, same order |
| PC-03 | Search is case-insensitive on name | Fixtures include "iPhone 16 Pro" | `query = 'ipHone'` | Returns the iPhone items |
| PC-04 | Search matches brand | Fixtures include Samsung items | `query = 'sams'` | Returns the Samsung items |
| PC-05 | Search with no match | Any fixtures | `query = 'zzz'` | Returns `[]` |
| PC-06 | Sort by price ascending | Fixtures with distinct prices | `sortBy = 'low'` | Prices in ascending order |
| PC-07 | Sort by price descending | Same | `sortBy = 'high'` | Prices in descending order |
| PC-08 | Featured keeps original order, no mutation | Same | `sortBy = 'featured'` | Same order as input; input array not mutated |

### Execution notes

- PC-01..PC-02 → cycle 1 (category filtering, happy path must be Red first).
- PC-03..PC-05 → cycle 2 (search semantics).
- PC-06..PC-08 → cycle 3 (sorting + immutability).

## Use Case: `getDevices(repo)` / `getDeviceById(repo, id)`

Application services over `DeviceRepository`. `getDeviceById` resolves the device
(including `stock`) or throws `DeviceNotFoundError`.

### Test Cases

| TC ID | Scenario | Precondition | Input | Expected Result |
|---|---|---|---|---|
| PC-09 | Fetch all devices from repository | Mock repo with 2 devices | `getDevices(repo)` | Returns the 2 devices from the repo |
| PC-10 | Fetch one device by id | Mock repo contains id `'3'` with stock | `getDeviceById(repo, '3')` | Returns that device including `stock: 12` |
| PC-11 | Unknown id is rejected | Mock repo has no id `'99'` | `getDeviceById(repo, '99')` | Throws `DeviceNotFoundError` with message `We couldn’t find that device.` |

### Execution notes

- PC-09 → cycle 4 (happy path).
- PC-10 → cycle 5 (detail lookup with stock).
- PC-11 → cycle 6 (error contract, exact user-facing message).

## Controller: `getDevicesController()` / `getDeviceByIdController(id)`

Wires the registry (InMemory repository) to the use cases.

| TC ID | Scenario | Expected Result |
|---|---|---|
| PC-12 | `getDevicesController()` returns the mock catalogue | 6 devices, first is "iPhone 16 Pro", every device has `stock: 12` |
| PC-13 | `getDeviceByIdController('3')` returns iPad Air | Name `iPad Air`, type `Tablets` |
| PC-14 | `getDeviceByIdController('99')` throws `DeviceNotFoundError` | Rejected with `DeviceNotFoundError` |
