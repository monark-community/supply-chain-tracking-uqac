// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Supply Chain Transactions
/// @notice This contract stores supply chain transactions with all relevant details
contract SupplyChain {

    // -------------------------------
    // Struct representing a transaction
    // -------------------------------
    struct Transaction {
        string uid;               // Transaction ID (e.g., T-001)
        string productUid;        // Product ID (e.g., P-001)
        string country;           // Country name
        string province;          // Province (can be empty)
        string actorName;         // Name of the actor (person or organization)
        uint256 timestamp;        // Unix timestamp of the transaction
        uint256 quantity;         // Quantity involved
        string unit;              // Unit of measure (e.g., kg)
        string eventType;         // Event type (e.g., Harvest, Transport)
        string actor;             // Actor ID (e.g., A-001)
        uint8 humidity;           // Humidity percentage (e.g., 21)
        int8 temperature;         // Temperature in Celsius
        bool criticalEvent;       // Whether a critical event was detected
        string transportDocRef;   // Transport document or reference
    }

    // -------------------------------
    // State variables
    // -------------------------------
    Transaction[] public transactions; // Array to store all transactions

    // -------------------------------
    // Events
    // -------------------------------
    event TransactionAdded(string uid, string productUid, uint256 timestamp);

    // -------------------------------
    // Functions
    // -------------------------------

    /// @notice Add a new transaction
    function addTransaction(
        string memory uid,
        string memory productUid,
        string memory country,
        string memory province,
        string memory actorName,
        uint256 timestamp,
        uint256 quantity,
        string memory unit,
        string memory eventType,
        string memory actor,
        uint8 humidity,
        int8 temperature,
        bool criticalEvent,
        string memory transportDocRef
    ) public {
        Transaction memory newTx = Transaction({
            uid: uid,
            productUid: productUid,
            country: country,
            province: province,
            actorName: actorName,
            timestamp: timestamp,
            quantity: quantity,
            unit: unit,
            eventType: eventType,
            actor: actor,
            humidity: humidity,
            temperature: temperature,
            criticalEvent: criticalEvent,
            transportDocRef: transportDocRef
        });

        transactions.push(newTx);

        emit TransactionAdded(uid, productUid, timestamp);
    }

    /// @notice Get total number of transactions
    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    /// @notice Get transaction by index
    function getTransaction(uint256 index) public view returns (Transaction memory) {
        require(index < transactions.length, "Index out of bounds");
        return transactions[index];
    }
}
