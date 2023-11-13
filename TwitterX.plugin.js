/**
 * @name TwitterX
 * @author Nears
 * @description Changes Twitter links to FXTwitter format for proper embedding when shared on Discord. 
 * @donate https://ko-fi.com/royriver
 * @source https://github.com/RoyRiv3r/TwitterX.plugin.js
 * @version 0.0.1
 */
//META{"name":"LinkConverterPlugin"}*//

// Define constants for the URLs
const ORIGINAL_URLS = /https:\/\/twitter\.com\/|https:\/\/x\.com\//g;
const NEW_URL = "https://fxtwitter.com/";

module.exports = class ExamplePlugin {
  load() {} // Called when the plugin is loaded

  start() {
    // Called when the plugin is started
    this.patchSendMessage();
  }

  stop() {} // Called when the plugin is stopped

  patchSendMessage() {
    const MessageActions = BdApi.findModuleByProps("sendMessage");
    const originalFunction = MessageActions.sendMessage;

    MessageActions.sendMessage = async function (channelId, messageData) {
      try {
        // Replace all occurrences of the original URLs with the new URL
        messageData.content = messageData.content.replace(
          ORIGINAL_URLS,
          NEW_URL
        );

        // Call the original sendMessage function
        return originalFunction.apply(this, arguments);
      } catch (error) {
        console.error("Error in sendMessage:", error);
      }
    };
  }
};
