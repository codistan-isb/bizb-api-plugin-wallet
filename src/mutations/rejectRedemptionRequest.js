import ReactionError from "@reactioncommerce/reaction-error";
export default async function rejectRedemptionRequest(parent, args, context) {

    const { collections } = context;
    const { Redemption, Wallets } = collections;
    const userId = args.userId;
    console.log("args", args);
    console.log("_id", userId);
    const redemption = await Redemption.findOne({ userId:userId});
    console.log("redemption", redemption);
    if (!redemption) {
        throw new Error("Redemption request not found");
    }
   if(redemption.status === "REJECTED" || redemption.status === "APPROVED"){
         throw new Error("Redemption request already" + redemption.status);
    }
   const updateRedemption =  await Redemption.updateOne(
    { userId },
    { $set: { status: "REJECTED" } }
);
   console.log("updateRedemption", updateRedemption);
   if (updateRedemption.nModified === 0) {
    throw new Error("Failed to update redemption request");
}
const redemptionUser =  await Redemption.findOne({ userId:userId});

    // Deduct the redeemed amount from the user's wallet
    const WalletuserId = redemption.userId;
    const amount = redemption.RedemptionAmount;
    console.log("amount", amount);

    // Find the user's wallet
    const userWallet = await Wallets.findOne({ userId:WalletuserId });

    // Check if the user's wallet exists
    if (!userWallet) {
        throw new Error("User's wallet not found");
    }

    const updateWallet =await Wallets.updateOne(
        { userId },
        { $inc: { escrow: -amount, amount:+amount } } // Decrease the amount by the redeemed amount
    );
    console.log("updateWallet", updateWallet);
    if (updateWallet.nModified === 0) {
        throw new Error("Failed to update user's wallet");
    }

    return redemptionUser;
}
