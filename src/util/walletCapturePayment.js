export default async function walletCapturePayment(context, paymentInput){
   const { collections } = context;
    const { Wallets, TransactionIncrement, Transactions, Payments,SubOrders, Accounts } = collections;

    const payment = await Payments.findOne({ _id: paymentInput._id }).toArray();
    const subOrder = await SubOrders.findOne({ _id: payment.subOrderId }).toArray();
    const user = await Accounts.findOne({ _id: subOrder.accountId }).toArray();
    const userId = user.userId;
  // Check if the user's wallet exists, if not, create it
  let userWallet = await Wallets.findOne({ userId: userId });
  userWallet.escrow -= payment.totalPrice;

  // Save the updated wallet
  const updatedWallet = await Wallets.updateOne(
    { _id: userWallet._id },
    { transactions: "outBound" },
    { $set: { escrow: userWallet.escrow } }
  );

  console.log("updatedWallet", updatedWallet);

  const sellerAccout = await Accounts.findOne({ userId: payment.sellerId }).toArray();
  let sellerWallet = await Wallets.findOne({ userId: userId });
  if (!sellerWallet) {
    // Create a new wallet for the user
    await Wallets.insert({ userId: sellerAccout.userId, amount: payment.amount , paymentProcessor:"Payment"}); 
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
  }
const bizbAccount = await Accounts.findOne({"emails.address":"bizb.store@gmail.com"}).toArray();
let bizbWallet = await Wallets.findOne({ userId: bizbAccount.userId });
if (!bizbWallet) {
  // Create a new wallet for the user
  await Wallets.insert({ userId: bizbAccount.userId, amount: payment.fee , paymentProcessor:"Platform fee", slug:"Bizb Store Wallet"}); 
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


}
else{
    bizbWallet.amount += payment.fee;
    // Save the updated wallet
    const updatedWallet = await Wallets.updateOne(
        { _id: bizbWallet._id },
        { transactions: "inBound" },
        { $set: { amount: bizbWallet.amount } }
    );
    
    console.log("updatedWallet", updatedWallet);

}
return { saved: true, response: {} };
}