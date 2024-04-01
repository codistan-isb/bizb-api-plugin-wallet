import ReactionError from "@reactioncommerce/reaction-error";
export default async function getAllRedemptionRequests(parent, args, context, info) {
  const {collections} = context;
    const {Redemption} = collections;
    const request = await Redemption.find().toArray();
    return request;
}
