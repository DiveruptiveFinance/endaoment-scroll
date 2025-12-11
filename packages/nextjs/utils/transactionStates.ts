/**
 * Transaction state types for UI
 */
export type TransactionState =
  | "idle"
  | "checking-allowance"
  | "approving"
  | "depositing"
  | "withdrawing"
  | "harvesting"
  | "splitting"
  | "success"
  | "error";

/**
 * Transaction state with message
 */
export interface TransactionStateWithMessage {
  state: TransactionState;
  message: string;
  txHash?: string;
  error?: string;
}

/**
 * Get user-friendly message for transaction state
 */
export function getTransactionMessage(state: TransactionState): string {
  switch (state) {
    case "idle":
      return "Ready";
    case "checking-allowance":
      return "Checking allowance...";
    case "approving":
      return "Approving USDC...";
    case "depositing":
      return "Depositing to vault...";
    case "withdrawing":
      return "Withdrawing from vault...";
    case "harvesting":
      return "Harvesting yield...";
    case "splitting":
      return "Splitting yield...";
    case "success":
      return "Transaction successful!";
    case "error":
      return "Transaction failed";
    default:
      return "Unknown state";
  }
}

/**
 * Check if state is a loading state
 */
export function isLoadingState(state: TransactionState): boolean {
  return ["checking-allowance", "approving", "depositing", "withdrawing", "harvesting", "splitting"].includes(state);
}

/**
 * Check if state is a final state
 */
export function isFinalState(state: TransactionState): boolean {
  return state === "success" || state === "error";
}


