// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SupplyChain
 * @notice Minimal contract to record supply-chain transactions with environmental data.
 * @dev This contract stores transactions in memory (an on-chain array). It's intentionally
 * simple for demonstration and testing; production use should consider indexing, storage
 * patterns, access control, event indexing and gas optimizations.
 */
contract SupplyChain {

    /**
     * @notice Input DTO for adding a transaction
     * @dev Used as an external memory struct so callers can construct a single argument
     *      instead of passing a long argument list. Field types chosen for simplicity.
     */
    struct TransactionInput {
        string uid; // Unique identifier for this transaction (client-provided)
        string productUid; // Identifier for the product/batch
        string country; // Country where the event occurred
        string province; // Province/state where the event occurred
        string actorName; // Human-readable actor name
        uint256 timestamp; // POSIX timestamp (seconds) when the event occurred
        uint256 quantity; // Quantity involved in the transaction
        string unit; // Unit of measure for quantity (e.g., kg, L)
        string eventType; // Semantic event type (e.g., "Harvest", "Transport")
        string actor; // Short actor code or address string (optional)
        uint8 humidity; // Environmental humidity (0-100)
        int8 temperature; // Temperature in degrees (can be negative)
        bool criticalEvent; // Flag marking whether the environmental data triggered an alert
        string transportDocRef; // Reference to a transport document (bill of lading, etc.)
    }

    /**
     * @notice Nested struct used to group environmental readings
     */
    struct Environment {
        uint8 humidity;
        int8 temperature;
        bool criticalEvent;
    }

    /**
     * @notice Primary transaction record stored on-chain
     */
    struct Transaction {
        string uid;
        string productUid;
        string country;
        string province;
        string actorName;
        uint256 timestamp;
        uint256 quantity;
        string unit;
        string eventType;
        string actor;
        Environment env; // Grouped environmental data
        string transportDocRef;
    }

    // Public array of transactions. Marked `public` so Solidity generates a getter.
    Transaction[] public transactions;

    /**
     * @notice Emitted when a new transaction is added
     * @param uid Unique transaction id
     * @param productUid Product/batch identifier
     * @param timestamp Event timestamp
     */
    event TransactionAdded(string uid, string productUid, uint256 timestamp);

    /**
     * @notice Add a new transaction record
     * @dev This function copies fields from the provided `TransactionInput` into
     *      the on-chain `Transaction` structure and pushes it into the `transactions`
     *      array. There is no access control in this example — any caller can add.
     * @param input The transaction input struct containing all relevant fields
     */
    function addTransaction(TransactionInput memory input) public {
        // Build the nested Environment struct from the input
        Environment memory env = Environment({
            humidity: input.humidity,
            temperature: input.temperature,
            criticalEvent: input.criticalEvent
        });

        // Compose the full Transaction struct
        Transaction memory newTx = Transaction({
            uid: input.uid,
            productUid: input.productUid,
            country: input.country,
            province: input.province,
            actorName: input.actorName,
            timestamp: input.timestamp,
            quantity: input.quantity,
            unit: input.unit,
            eventType: input.eventType,
            actor: input.actor,
            env: env,
            transportDocRef: input.transportDocRef
        });

        // Store the transaction on-chain
        transactions.push(newTx);

        // Emit an event for off-chain indexing and listeners
        emit TransactionAdded(input.uid, input.productUid, input.timestamp);
    }

    /**
     * @notice Returns the number of stored transactions
     * @return uint256 The current length of the transactions array
     */
    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    /**
     * @notice Retrieve a transaction by array index
     * @dev Returns the entire Transaction struct. Callers should ensure they pass
     *      a valid index; the function will revert on out-of-bounds access.
     * @param index Index in the transactions array
     * @return Transaction The stored transaction at the provided index
     */
    function getTransaction(uint256 index) public view returns (Transaction memory) {
        require(index < transactions.length, "Index out of bounds");
        return transactions[index];
    }
}
