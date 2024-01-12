/**
 * @name TwitterX
 * @author Nears
 * @description Changes Twitter links to FXTwitter format for proper embedding when shared on Discord.
 * @donate https://ko-fi.com/royriver
 * @source https://github.com/RoyRiv3r/TwitterX.plugin.js
 * @updateURL https://raw.githubusercontent.com/RoyRiv3r/TwitterX.plugin.js/main/TwitterX.plugin.js
 * @version 0.0.3
 */

//META{"name":"TwitterLinkConverter"}*//

// Constants for the URLs
const ORIGINAL_URLS = /https:\/\/twitter\.com\/|https:\/\/x\.com\//g;
const NEW_URL = "https://fxtwitter.com/";

class TwitterLinkConverter {
  // Called when the plugin is loaded
  load() {}

  // Called when the plugin is started
  start() {
    this.patchSendMessage();
    this.patchUploadFiles();
  }

  // Called when the plugin is stopped
  stop() {}

  // Patch the sendMessage method
  patchSendMessage() {
    const MessageActions = BdApi.findModuleByProps("sendMessage");

    BdApi.Patcher.before(
      "TwitterLinkConverter",
      MessageActions,
      "sendMessage",
      (_, props) => {
        // Replace all occurrences of the original URLs with the new URL in sendMessage
        props[1].content = props[1].content.replace(ORIGINAL_URLS, NEW_URL);
      }
    );
  }

  // Patch the uploadFiles method
  patchUploadFiles() {
    const MessageActions = BdApi.findModuleByProps("uploadFiles");

    BdApi.Patcher.before(
      "TwitterLinkConverter",
      MessageActions,
      "uploadFiles",
      (_, props) => {
        // Check if the parsedMessage property exists before trying to replace the URL in uploadFiles
        if (props[0].parsedMessage && props[0].parsedMessage.content) {
          props[0].parsedMessage.content =
            props[0].parsedMessage.content.replace(ORIGINAL_URLS, NEW_URL);
        }
      }
    );
  }
}

module.exports = TwitterLinkConverter;
