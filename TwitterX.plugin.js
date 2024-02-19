/**
 * @name TwitterX
 * @author Nears
 * @description Changes Twitter, TikTok, and Instagram links to their respective modified formats for proper embedding when shared on Discord.
 * @donate https://ko-fi.com/royriver
 * @source https://github.com/RoyRiv3r/TwitterX.plugin.js
 * @updateURL https://raw.githubusercontent.com/RoyRiv3r/TwitterX.plugin.js/main/TwitterX.plugin.js
 * @version 0.0.4
 */
//META{"name":"SocialMediaLinkConverter"}*//
const SettingsPanel = BdApi.findModuleByProps(
  "FormItem",
  "FormSection",
  "FormTitle"
);

class SocialMediaLinkConverter {
  constructor() {
    this.settings = {
      convertTwitter: true,
      convertTikTok: true,
      convertInstagram: true,
    };
    this.defaultConfig = [
      {
        type: "switch",
        id: "convertTwitter",
        // name: "Convert Twitter Links",
        note: "Convert Twitter links to FXTwitter format",
        value: true,
      },
      {
        type: "switch",
        id: "convertTikTok",
        // name: "Convert TikTok Links",
        note: "Convert TikTok links to VXTikTok format",
        value: true,
      },
      {
        type: "switch",
        id: "convertInstagram",
        // name: "Convert Instagram Links",
        note: "Convert Instagram links to DDInstagram format",
        value: true,
      },
    ];
  }

  load() {
    this.settings =
      BdApi.loadData("SocialMediaLinkConverter", "settings") || this.settings;
  }

  start() {
    this.patchSendMessage();
    this.patchUploadFiles();
  }

  stop() {
    BdApi.Patcher.unpatchAll("SocialMediaLinkConverter");
  }

  patchSendMessage() {
    const MessageActions = BdApi.findModuleByProps("sendMessage");
    BdApi.Patcher.before(
      "SocialMediaLinkConverter",
      MessageActions,
      "sendMessage",
      (_, args) => {
        let [channelId, message, messageId] = args;
        if (this.settings.convertTwitter) {
          message.content = message.content.replace(
            /https:\/\/twitter\.com\//g,
            "https://fxtwitter.com/"
          );
        }
        if (this.settings.convertTikTok) {
          message.content = message.content.replace(
            /https:\/\/www\.tiktok\.com\//g,
            "https://www.vxtiktok.com/"
          );
        }
        if (this.settings.convertInstagram) {
          message.content = message.content.replace(
            /https:\/\/www\.instagram\.com\//g,
            "https://www.ddinstagram.com/"
          );
        }
        args[1] = message;
      }
    );
  }

  patchUploadFiles() {
    const MessageActions = BdApi.findModuleByProps("uploadFiles");
    BdApi.Patcher.before(
      "SocialMediaLinkConverter",
      MessageActions,
      "uploadFiles",
      (_, props) => {
        if (props.parsedMessage && props.parsedMessage.content) {
          if (this.settings.convertTwitter) {
            props.parsedMessage.content = props.parsedMessage.content.replace(
              /https:\/\/twitter\.com\//g,
              "https://fxtwitter.com/"
            );
          }
          if (this.settings.convertTikTok) {
            props.parsedMessage.content = props.parsedMessage.content.replace(
              /https:\/\/www\.tiktok\.com\//g,
              "https://www.vxtiktok.com/"
            );
          }
          if (this.settings.convertInstagram) {
            props.parsedMessage.content = props.parsedMessage.content.replace(
              /https:\/\/www\.instagram\.com\//g,
              "https://www.ddinstagram.com/"
            );
          }
        }
      }
    );
  }

  getSettingsPanel() {
    const panel = document.createElement("div");

    this.defaultConfig.forEach((setting, index) => {
      if (setting.type === "switch") {
        const switchElement = this.createToggle(
          setting.name,
          setting.note,
          this.settings[setting.id],
          (checked) => {
            this.settings[setting.id] = checked;
            BdApi.saveData(
              "SocialMediaLinkConverter",
              "settings",
              this.settings
            );
          }
        );
        panel.appendChild(switchElement);

        // Make the text note white
        switchElement.querySelector(".toggle-note").style.color = "#FFFFFF";

        // Add a separator except after the last element
        if (index < this.defaultConfig.length - 1) {
          const separator = document.createElement("hr");
          separator.style.margin = "10px 0";
          panel.appendChild(separator);
        }
      }
    });

    return panel;
  }

  createToggle(name, note, isChecked, onChange) {
    const toggleContainer = document.createElement("div");
    toggleContainer.className = "toggle-container";

    const toggleNote = document.createElement("div");
    toggleNote.className = "toggle-note";
    toggleNote.textContent = note;
    toggleContainer.appendChild(toggleNote);

    const toggleLabel = document.createElement("label");
    toggleLabel.className = "toggle";
    toggleContainer.appendChild(toggleLabel);

    const toggleInput = document.createElement("input");
    toggleInput.type = "checkbox";
    toggleInput.checked = isChecked;
    toggleInput.onchange = (e) => onChange(e.target.checked);
    toggleLabel.appendChild(toggleInput);

    const toggleSlider = document.createElement("span");
    toggleSlider.className = "slider round";
    toggleLabel.appendChild(toggleSlider);

    const toggleName = document.createElement("span");
    toggleName.className = "toggle-name";
    toggleName.textContent = name;
    toggleContainer.appendChild(toggleName);

    return toggleContainer;
  }
}

module.exports = SocialMediaLinkConverter;
