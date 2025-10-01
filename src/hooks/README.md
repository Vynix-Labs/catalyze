# API Hooks

This folder contains TanStack Query hooks for API endpoints.

## Available Hooks

### Auth Hooks (`useAuth.ts`)

- `useSetPin()` - Set transaction PIN
- `useVerifyPin()` - Verify transaction PIN
- `useAuthStatus()` - Get authentication status

### Fiat Hooks (`useFiat.ts`)

- `useInitiateDeposit()` - Initiate fiat deposit
- `useConfirmDeposit()` - Confirm fiat deposit
- `useFiatData()` - Get fiat data and transactions

## Usage Examples

### Setting a PIN

```tsx
import { useSetPin } from "../hooks/useAuth";

function SetPinComponent() {
  const setPinMutation = useSetPin();

  const handleSetPin = (pin: string) => {
    setPinMutation.mutate(
      { pin },
      {
        onSuccess: (data) => {
          console.log("PIN set successfully:", data);
        },
        onError: (error) => {
          console.error("Failed to set PIN:", error);
        },
      }
    );
  };

  return (
    <button
      onClick={() => handleSetPin("1234")}
      disabled={setPinMutation.isPending}
    >
      {setPinMutation.isPending ? "Setting..." : "Set PIN"}
    </button>
  );
}
```

### Initiating a Deposit

```tsx
import { useInitiateDeposit } from "../hooks/useFiat";

function DepositComponent() {
  const initiateDepositMutation = useInitiateDeposit();

  const handleDeposit = () => {
    initiateDepositMutation.mutate(
      {
        amount: 100,
        currency: "USD",
        paymentMethod: "card",
      },
      {
        onSuccess: (data) => {
          console.log("Deposit initiated:", data);
          // Redirect to payment URL if provided
          if (data.paymentUrl) {
            window.location.href = data.paymentUrl;
          }
        },
        onError: (error) => {
          console.error("Failed to initiate deposit:", error);
        },
      }
    );
  };

  return (
    <button
      onClick={handleDeposit}
      disabled={initiateDepositMutation.isPending}
    >
      {initiateDepositMutation.isPending ? "Processing..." : "Deposit $100"}
    </button>
  );
}
```

### Fetching Data

```tsx
import { useFiatData } from "../hooks/useFiat";

function FiatDataComponent() {
  const { data, isLoading, error } = useFiatData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>
        Balance: {data?.balance} {data?.currency}
      </h2>
      <h3>Transactions:</h3>
      <ul>
        {data?.transactions.map((transaction, index) => (
          <li key={index}>{JSON.stringify(transaction)}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Configuration

The hooks are configured with:

- 5-minute stale time for queries
- 1 retry attempt for failed requests
- Automatic error handling for 401 responses
- Request/response interceptors for auth tokens
