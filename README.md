# Low-level transaction

This repo exists to help walk through how to sign a transaction, outputting the structures and/or bytes along the way.

This does not actually send a transaction to the blockchain, because the access key nonce and latest block hash are hardcoded. This is done to help assist with porting these concepts to another language.

The goal is to make sure that implementations in other languages have correctly implemented serialization and other processes needed to sign a transaction.
