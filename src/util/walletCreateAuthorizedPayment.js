import Random from "@reactioncommerce/random";

const METHOD = "wallet";
const PACKAGE_NAME = "bizb-wallet";
const PAYMENT_METHOD_NAME = "wallet";

export async function walletCreateAuthorizedPayment(context, input) {
  const {
    accountId,
    amount,
    billingAddress,
    currencyCode,
    email,
    shippingAddress,
    shopId,
  } = input;
  const { collections } = context;
  const { Transactions, TransactionIncrement, Accounts, Wallets } = collections;
  // Add TransactionType as "outbound" to the input object
  console.log("input", input);
  const user = await Accounts.find({ _id: accountId }).toArray();
  console.log("user", user);
  const userId = user[0].userId;
  console.log("userId", userId);
  const updatedInput = {
    userId: userId,
    amount: input.amount,
    transactions: "outBound",
  };
  let userWallet = await Wallets.find({ userId: userId });
  if (!userWallet) {
    throw new Error(
      "Wallet not found: User does not have a wallet and cannot make a payment from it."
    );
  }
  // Call makeTransaction mutation to cut amount from the wallet
  const wallet = await context.mutations.makeTransaction(
    null,
    updatedInput,
    context,
    null
  );

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
  console.log("newTransaction", newTransaction);
  return {
    _id: Random.id(),
    address: billingAddress,
    amount: amount,
    createdAt: new Date(),
    data: {
      walletId: wallet._id,
      gqlType: "WalletAuthorizedPayment",
    },
    displayName: `Wallet`,
    method: METHOD,
    mode: "authorize",
    name: PAYMENT_METHOD_NAME,
    paymentPluginName: "wallet",
    processor: "wallet",
    riskLevel: "normal",
    shopId,
    status: "created",
    transactionId: newTransaction.id,
    transactions: [newTransaction],
  };
}
