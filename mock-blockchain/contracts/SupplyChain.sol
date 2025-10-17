// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SupplyChain {

    // Define a struct to encapsulate all transaction details
    struct TransactionInput {
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
        uint8 humidity;
        int8 temperature;
        bool criticalEvent;
        string transportDocRef;
    }

    // Define a nested struct for environmental data
    struct Environment {
        uint8 humidity;
        int8 temperature;
        bool criticalEvent;
    }

    // Define the main Transaction struct
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
        Environment env;
        string transportDocRef;
    }

    // Array to store all transactions
    Transaction[] public transactions;

    // Event to log new transactions
    event TransactionAdded(string uid, string productUid, uint256 timestamp);

    // Function to add a new transaction
    function addTransaction(TransactionInput memory input) public {
        // Create an Environment struct from the input
        Environment memory env = Environment({
            humidity: input.humidity,
            temperature: input.temperature,
            criticalEvent: input.criticalEvent
        });

        // Create a Transaction struct from the input and the Environment struct
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

        // Add the new transaction to the transactions array
        transactions.push(newTx);

        // Emit the TransactionAdded event
        emit TransactionAdded(input.uid, input.productUid, input.timestamp);
    }

    // Function to get the total number of transactions
    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    // Function to get a specific transaction by index
    function getTransaction(uint256 index) public view returns (Transaction memory) {
        require(index < transactions.length, "Index out of bounds");
        return transactions[index];
    }
}
