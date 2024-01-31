import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

/**
 * @summary Import and call this function to add this plugin to your API.
 * @param {Object} app The ReactionAPI instance
 * @returns {undefined}
 */
export default async function register(app) {
  await app.registerPlugin({
    label: "bizb-api-plugin-wallet",
    name: "bizb-api-plugin-wallet",
    version: pkg.version,
    collections: {
      Wallet: {
        name: "Wallet",
      },
    },
  });
}
