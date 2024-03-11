import Random from "@reactioncommerce/random";

export default async function walletCapturePayment(context, paymentInput) {
  const { collections } = context;
  console.log("paymentInput", paymentInput);
  const {
    Wallets,
    TransactionIncrement,
    Transactions,
    Payments,
    SubOrders,
    Accounts,
    Orders,
  } = collections;
  const { orderId } = paymentInput;
  // Fetch order details using the provided order ID
  const order = await Orders.findOne({ _id: orderId });
  if (!order) {
    throw new Error("Order not found");
  }

  // Extract items from the shipping array
  const { shipping } = order;
  console.log("shipping", shipping);
  if (!shipping || shipping.length === 0) {
    throw new Error("No items found in the shipping details");
  }

  for (const shipment of shipping) {
    // Extract items from the current shipment
    const { items, sellerId, invoice } = shipment;
    console.log("invoice", invoice);
    console.log("total", invoice.total);
    if (!items || items.length === 0) {
      throw new Error("No items found in the shipment");
    }

    for (const item of items) {
      console.log("item", item);
      // Check if the item's status is "Completed"
      if (item.workflow.status === "Completed") {
        // Find the payment associated with the item ID
        const payment = await Payments.findOne({ itemId: item._id });
        console.log("payment", payment);
        if (!payment) {
          throw new Error(`Payment not found for item ID: ${item._id}`);
        }
        const subOrderId = payment.subOrderId; // Access subOrderId from the first payment object
        console.log("payment suborder", subOrderId);
        const subOrder = await SubOrders.findOne({ _id: subOrderId });
        console.log("subOrder", subOrder);
        const user = await Accounts.findOne({ _id: subOrder.accountId });
        console.log("user", user);
        const userId = user.userId;
        // Check if the user's wallet exists, if not, create it
        let userWallet = await Wallets.findOne({ userId: userId });
        console.log("userWallet", userWallet);
        userWallet.escrow -= invoice.total;
        console.log("userWallet escrow", userWallet);

        // Save the updated wallet
        const updatedWallet = await Wallets.updateOne(
          { _id: userWallet._id },
          { $set: { escrow: userWallet.escrow, transactions: "outBound" } } // Update escrow and transactions
        );

        console.log("updatedWallet", updatedWallet);

        const sellerAccout = await Accounts.findOne({
          userId: sellerId,
        });
        console.log("sellerAccout", sellerAccout);
        let sellerWallet = await Wallets.findOne({ userId: userId });
        console.log("sellerWallet", sellerWallet);
        if (!sellerWallet) {
          // Create a new wallet for the user
          const sellerwallet = await Wallets.insert({
            userId: sellerAccout.userId,
            amount: payment.amount,
            paymentProcessor: "Payment",
          });
          console.log("sellerwallet", sellerwallet);
        } else {
          sellerWallet.amount += payment.amount;
          // Save the updated wallet
          const updatedWalletSeller = await Wallets.findOneAndUpdate(
            { _id: sellerWallet._id },
            { $set: { amount: sellerWallet.amount, transactions: "inBound" } }
          );

          console.log("updatedWallet in seller else", updatedWalletSeller);
        }

        const bizbAccount = await Accounts.findOne({
          "emails.address": "bizb.store@gmail.com",
        });
        console.log("bizbAccount", bizbAccount);
        let bizbWallet = await Wallets.findOne({ userId: bizbAccount.userId });
        console.log("bizbWallet", bizbWallet);
        if (!bizbWallet) {
          // Create a new wallet for the user
          await Wallets.insert({
            userId: bizbAccount.userId,
            amount: payment.fee,
            paymentProcessor: "Platform fee",
            slug: "Bizb Store Wallet",
          });
        } else {
          bizbWallet.amount += payment.fee;
          // Save the updated wallet
          const updatedBizbWallet = await Wallets.findOneAndUpdate(
            { _id: bizbWallet._id },
            { $set: { amount: bizbWallet.amount, transactions: "inBound" } }
          );

          console.log("updatedWallet bizb", updatedBizbWallet);
        }
      }
    }
  }
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

  // Create a new Transactions record for the refund
  const newTransaction = {
    id: Random.id(), // Assuming you generate a unique ID for the Transactions
    transactionById:order.accountId,
    orderID: orderId,
    amount: paymentInput.payment.amount,
    paymentProcessor: "Refund", // Assuming payment processor is labeled as "Refund"
    transactionStatus: "APPROVED", // Assuming refund Transactions is approved
    transactionType: "inBound", // Assuming refund Transactions type is inbound
    referenceId: nextReferenceId, // Using the next referenceId
  };

  // Insert the new Transactions record into the Transactions collection
  const trans =await Transactions.insert(newTransaction);
  console.log("newTransaction", trans);
  return { saved: true, response: {newTransaction} };
}
