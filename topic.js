
require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  TopicCreateTransaction,
  TopicMessageQuery,
  TopicMessageSubmitTransaction,
  TopicUpdateTransaction
} = require("@hashgraph/sdk");

// Grab the OPERATOR_ID and OPERATOR_KEY from the .env file
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = process.env.MY_PRIVATE_KEY;

// Build Hedera testnet and mirror node client
const client = Client.forTestnet();

// Set the operator account ID and operator private key
client.setOperator(myAccountId, myPrivateKey);

async function submitPrivateMessage() {

     //Create new keys
     const newAccountPrivateKey = PrivateKey.generateED25519();
     const newAccountPublicKey = newAccountPrivateKey.publicKey;

  // Create a new topic
const topicCreateTransaction = await new TopicCreateTransaction()
.setSubmitKey(myPrivateKey.publicKey)
.setAdminKey(newAccountPrivateKey)
.execute(client);


let topicreceipt = await topicCreateTransaction.getReceipt(client);

let topicId = topicreceipt.topicId;

  //Create a transaction to add a submit key
const transaction = await new TopicUpdateTransaction()
.setTopicId(topicId)
.setSubmitKey(myPrivateKey.publicKey) 
.setAdminKey(newAccountPrivateKey)
.setTopicMemo("the initial memo")
.freezeWith(client);


//Sign the transaction with the admin key to authorize the update
const signTx = await transaction.sign(adminKey);

//Sign with the client operator private key and submit to a Hedera network
const txResponse = await signTx.execute(client);

//Request the receipt of the transaction
const receipt = await txResponse.getReceipt(client);

//Get the transaction consensus status
const transactionStatus = receipt.status;

 
 console.log("The transaction consensus status is " +transactionStatus.toString());

 console.log(`Your topic ID is: ${topicId}`);

let TopicMemo = receipt.TopicMemo;
console.log(`The memo of the topic  is: ${TopicMemo}`);

 



async function updateTopicMemo(topicId, memo, operatorAccount) {
    const client = Client.forTestnet();
    client.setOperator(operatorAccount);
  
    const transactionId = await new TopicUpdateTransaction()
      .setTopicId(topicId)
      .setTopicMemo(memo)
      .execute(client);
  
    const transactionReceipt = await transactionId.getReceipt(client);
  
    console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
  }
  
  updateTopicMemo(topicId, "the new memo", operatorAccount)

  let NTopicMemo = receipt.TopicMemo;
  console.log(`The memo of the topic  is: ${NTopicMemo}`);

  // Wait 5 seconds between consensus topic creation and subscription creation
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Create the topic
  new TopicMessageQuery()
    .setTopicId(topicId)
    .subscribe(client, null, (message) => {
      let messageAsString = Buffer.from(message.contents, "utf8").toString();
      console.log(
        `${message.consensusTimestamp.toDate()} Received: ${messageAsString}`
      );
    });

  // Send message to private topic
  let submitMsgTx = await new TopicMessageSubmitTransaction({
    topicId: topicId,
    message: "this is the message sent to the topic!",
  })
  .freezeWith(client)
  .sign(myPrivateKey);

  let submitMsgTxSubmit = await submitMsgTx.execute(client);
  let getReceipt = await submitMsgTxSubmit.getReceipt(client);

  const MessagetransactionStatus = getReceipt.status
  console.log("The message transaction status " + MessagetransactionStatus.toString()) 
}

submitPrivateMessage();