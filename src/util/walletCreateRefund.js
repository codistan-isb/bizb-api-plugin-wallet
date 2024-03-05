export async function walletCreateRefund(context, input) {
  const {
    accountId, // Assuming accountId is the user ID associated with the wallet
    amount, // Amount to refund
    orderId, // Assuming orderId is the ID of the order associated with the refund
    shopId, // Assuming shopId is the ID of the shop
  } = input;

  const { collections } = context;
  const { Transactions, TransactionIncrement, Accounts, Wallets } = collections;
  // Add TransactionType as "inbound" to the input object since it's a refund
 
  const user = await Accounts.findOne({ _id: accountId }).toArray();

  const userId = user.userId;
  // Check if the user's wallet exists, if not, create it
  let userWallet = await Wallets.findOne({ userId: userId });
  if (!userWallet) {
    // Create a new wallet for the user
    await Wallets.insert({ userId: userId, amount: amount , paymentProcessor:"Refund"}); 
    const result = await TransactionIncrement.findOneAndUpdate(
      {}, // Find any document
      { $inc: { referenceId: 1 } }, // Increment referenceId by 1
      { 
        upsert: true, // If no document matches, create one
        returnOriginal: false // Return the updated document
      }
    );
    
    // Get the updated referenceId
    const nextReferenceId = result.value.referenceId;
    
    // Create a new transaction record
    const newTransaction = {
      id: Random.id(),
      transactionById: accountId,
      orderID: shopId,
      amount: amount,
      paymentProcessor: "Wallet",
      transactionStatus: "APPROVED",
      transactionType: "outBound",
      referenceId: nextReferenceId,
    };
    
    await Transactions.insertOne(newTransaction);

  // Return the result
  return {
    _id: Random.id(), // Assuming you generate a unique ID for the refund record
    amount: amount,
    transactionStatus: "APPROVED", // Assuming refund Transactions is approved
    transactionType: "inBound",
  };

  }
  else {
  const updatedInput = {
    userId: userId,
    amount: amount,
    TransactionType: "inBound",
    type: "Refund"
  };
  // Call makeTransaction mutation to add the refunded amount back to the wallet
  const wallet = await context.mutations.updateWalletAmount(
    parent,
    updatedInput,
    context,
    info
  );

  // Fetch the last referenceId from the database
  const transactionIncrement = await TransactionIncrement.findOne();
  let nextReferenceId = 1;
  if (transactionIncrement) {
    // Increment the referenceId and update the document
    nextReferenceId = transactionIncrement.referenceId + 1;
    await TransactionIncrement.update(
      {},
      { $set: { referenceId: nextReferenceId } }
    );
  } else {
    // If no document exists, create one with referenceId 1
    await TransactionIncrement.insert({ referenceId: 1 });
  }

  // Create a new Transactions record for the refund
  const newTransaction = {
    id: Random.id(), // Assuming you generate a unique ID for the Transactions
    transactionById: accountId,
    orderID: orderId,
    amount: amount,
    paymentProcessor: "Refund", // Assuming payment processor is labeled as "Refund"
    transactionStatus: "APPROVED", // Assuming refund Transactions is approved
    transactionType: "inBound", // Assuming refund Transactions type is inbound
    referenceId: nextReferenceId, // Using the next referenceId
  };

  // Insert the new Transactions record into the Transactions collection
  await Transactions.insert(newTransaction);

  // Return the result
  return {
    _id: Random.id(), // Assuming you generate a unique ID for the refund record
    amount: amount,
    transactionStatus: "APPROVED", // Assuming refund Transactions is approved
    transactionType: "inBound",
  };
}
}
