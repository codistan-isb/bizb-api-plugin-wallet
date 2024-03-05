export async function walletListRefunds(context, input) {
    const {collections} = context;
    const {Transactions} = collections;
    const {payment} = input;
    console.log("input", input);

    const refunds = await Transactions.find({id: input.transactionld}).toArray();
    console.log("refunds", refunds);
  
    return refunds.map((refund) => ({
      _id: refund._id,
      amount: refund.amount,
      currency: "wallet",
      raw: {},
      reason: "refund",
      type: "refund"
    }));
  }
