export default async function transactions(parent, args, context, info) {
  const { collections } = context;
  const { Transactions } = collections;
  try {
    const allTransactions = await Transactions.find();
    return allTransactions;
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    throw error;
  }
}
