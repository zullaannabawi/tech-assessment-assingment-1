# Test Cases — Purchase

> Test case list for the purchase feature. Cases are implemented one by one
> following the TDD cycle (Red → Green → Refactor).

## Use Case: `purchaseDevice(repo, input)`

Business rules extracted from the original inline `buy()`:

1. The device must exist → otherwise throw `DeviceNotFoundError`.
2. The device must be in stock (`stock >= 1`) → otherwise throw `OutOfStockError`.
3. The device price must not exceed the wallet balance → otherwise **resolve**
   with `{ status: 'insufficient_balance' }` (a result, not an error — this is
   how the original simulated API behaved).
4. A successful purchase resolves with an `ORB-` order reference built from the
   last 8 digits of the current timestamp.

The 1100ms network simulation lives in the **controller**, not the use case,
so these rules are tested instantly.

| TC ID | Scenario | Precondition | Input | Expected Result |
|---|---|---|---|---|
| PU-01 | Successful purchase | Device $799, stock 12 | `{ deviceId, balance: 1050 }` | `{ status: 'success', orderId: /^ORB-\d{8}$/, total: 799 }` |
| PU-02 | Insufficient balance is a result, not an error | Device $1299 | `{ deviceId, balance: 1050 }` | Resolves `{ status: 'insufficient_balance' }` |
| PU-03 | Out of stock throws | Device with `stock: 0` | any balance | Rejects with `OutOfStockError` (`This device is out of stock.`) |
| PU-04 | Unknown device throws | No device with that id | any | Rejects with `DeviceNotFoundError` |
| PU-05 | Insufficient balance yields no order id | Same as PU-02 | — | Result has no `orderId` property |

## Controller: `purchaseDeviceController(input)`

Adds the original 1100ms "buy API" delay around the use case.

| TC ID | Scenario | Expected Result |
|---|---|---|
| PU-06 | Success arrives after the simulated latency | Success result identical to PU-01 |
| PU-07 | Insufficient balance arrives after the latency | `{ status: 'insufficient_balance' }` |

### Execution notes

- PU-01 → cycle 1 (happy path).
- PU-02 + PU-05 → cycle 2 (balance rule — the parity-critical "result, not
  throw" semantics).
- PU-03 → cycle 3 (stock rule).
- PU-04 → cycle 4 (unknown device reuses the catalogue error contract).
- PU-06..07 → cycle 5 (controller delay with fake timers).
