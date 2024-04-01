import ReactionError from "@reactioncommerce/reaction-error";

export default async function requestRedemption(parent, args, context, info) {
    const { collections } = context;
    const { Redemption, Wallets } = collections;
    const userId = args.userId;
    const RedemptionAmount = args.amount;

    // Retrieve the current reference number
    const lastRedemption = await Redemption.findOne({}, { sort: { referenceId: -1 } });
    const currentReferenceId = lastRedemption ? lastRedemption.referenceId + 1 : 1;

    // Check user's wallet balance
    const wallet = await Wallets.findOne({ userId: userId });
    if (!wallet || wallet.amount < RedemptionAmount) {
        throw new Error("Insufficient funds");
    }


    // Insert the new redemption with the incremented reference number
    const redemption = await Redemption.insertOne({
        userId,
        RedemptionAmount,
        status: "PENDING",
        referenceId: currentReferenceId,
        createdAt: new Date(),
        updatedAt: new Date()
    });
console.log("redemption", redemption);
    // Update the wallet with the new escrow amount
    const updatedWallet = await Wallets.updateOne({ userId }, { 
        $set: { updatedAt: new Date() , transactions:"redemption"}, // Update updatedAt field
        $inc: { amount: -RedemptionAmount, escrow: +RedemptionAmount } // Update amount and escrow fields

    });

    return redemption.ops[0];
}
