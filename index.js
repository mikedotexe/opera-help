const { connect, keyStores, utils, transactions } = require("near-api-js");
const sha256 = require("js-sha256");

async function transferNEAR() {
    const senderId = "opera.mike.testnet";
    console.log('senderId', senderId);

    const receiverId = "mike.testnet";
    console.log('receiverId', receiverId);

    // Set up private key for opera.mike.testnet
    const privateKey = 'ed25519:5yfMnesmugx3mHrXXFa8ubXxazRkGSt2RHwm7RbNNR9d52KXHG6R6jNfCV5hUagcnrTnbREBeNL5CrTRKqMGGUag';
    const keyPair = utils.key_pair.KeyPairEd25519.fromString(privateKey);
    const keyStore = new keyStores.InMemoryKeyStore();
    await keyStore.setKey('testnet', senderId, keyPair)
    const config = {
        keyStore,
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
    };

    // Connect to NEAR
    const near = await connect({ ...config, keyStore });
    const sender = await near.account(senderId);

    // Get and show public key object
    const publicKey = keyPair.getPublicKey();
    console.log('publicKey', publicKey)

    // Set hardcoded values so we can be sure serialization is happening as expected
    const hardcodedNonce = 79693606000001;
    console.log('Hardcoded nonce', hardcodedNonce)
    const hardcodedBlockHash = utils.serialize.base_decode('8HNqQCLrZduZvcTzAKYn87v7wsVvsndZHR86BtahKuwV');
    console.log('Hardcoded block hash', hardcodedBlockHash)
    const hardcodedBlockHashAsBytes = new Uint8Array(hardcodedBlockHash)
    console.log('Hardcoded block hash as bytes', hardcodedBlockHashAsBytes)

    const amount = utils.format.parseNearAmount('0.006');
    const actions = [
        transactions.transfer(amount)
    ];

    const transaction = transactions.createTransaction(
        senderId,
        publicKey,
        receiverId,
        hardcodedNonce,
        actions,
        hardcodedBlockHash
    );
    console.log('transaction', transaction)

    const serializedTx = utils.serialize.serialize(
        transactions.SCHEMA,
        transaction
    );
    console.log('serializedTx', serializedTx)
    const serializedTxAsBytes = new Uint8Array(serializedTx)
    console.log('serializedTx as bytes', serializedTxAsBytes)
    console.log('See all bytes of this…')
    process.stdout.write(JSON.stringify(serializedTxAsBytes) + '\n');

    const serializedTxHash = new Uint8Array(sha256.sha256.array(serializedTx));
    console.log('serializedTxHash', serializedTxHash)

    const signature = keyPair.sign(serializedTxHash);
    console.log('signature', signature)

    const signedTransaction = new transactions.SignedTransaction({
        transaction,
        signature: new transactions.Signature({
            keyType: transaction.publicKey.keyType,
            data: signature.signature,
        }),
    });
    console.log('signedTransaction', signedTransaction)

    // encodes transaction to serialized Borsh (required for all transactions)
    const signedSerializedTx = signedTransaction.encode();
    console.log('signedSerializedTx', signedSerializedTx)
    const signedSerializedTxAsBytes = new Uint8Array(signedSerializedTx)
    console.log('signedSerializedTx as bytes', signedSerializedTxAsBytes)
    console.log('See all bytes of this…')
    process.stdout.write(JSON.stringify(signedSerializedTxAsBytes) + '\n');

    const base64Encoded = Buffer.from(signedSerializedTx).toString("base64");
    console.log('\nbase64Encoded', base64Encoded)
}

transferNEAR().then(() => {
    console.log('\nfinished.')
});

