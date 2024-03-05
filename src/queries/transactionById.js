export default async function transactionById(parent, args, context, info) {
  try {
    const { collections } = context;
    const { Transactions } = collections;

    const transaction = await Transactions.findOne({ transactionById: id });

    return transaction;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
