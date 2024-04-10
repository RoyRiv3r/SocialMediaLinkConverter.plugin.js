/**
 * @name SocialMediaLinkConverter
 * @author Nears
 * @description Changes Twitter, TikTok, Bsky, Threads, Reddit, Pixiv, DeviantArt and Instagram links to their respective modified formats for proper embedding when shared on Discord.
 * @donate https://ko-fi.com/royriver
 * @source https://github.com/RoyRiv3r/SocialMediaLinkConverter.plugin.js
 * @updateURL https://raw.githubusercontent.com/RoyRiv3r/SocialMediaLinkConverter.plugin.js/main/SocialMediaLinkConverter.plugin.js
 * @version 0.0.9
 */

class SocialMediaLinkConverter {
  constructor() {
    this.settings = {
      convertTwitter: true,
      convertTikTok: true,
      convertInstagram: true,
      convertBsky: true,
      convertThreads: true,
      convertReddit: true,
      convertPixiv: true,
      convertDeviantArt: true,
    };

    this.conversionRules = [
      {
        id: "convertTwitter",
        regex: /https:\/\/(twitter\.com|x\.com)\//g,
        replacement: "https://fxtwitter.com/",
      },
      {
        id: "convertTikTok",
        regex: /https:\/\/www\.tiktok\.com\//g,
        replacement: "https://www.vxtiktok.com/",
      },
      {
        id: "convertInstagram",
        regex: /https:\/\/www\.instagram\.com\//g,
        replacement: "https://www.ddinstagram.com/",
      },
      {
        id: "convertBsky",
        regex: /https:\/\/bsky\.app\//g,
        replacement: "https://bsyy.app/",
      },
      {
        id: "convertThreads",
        regex: /https:\/\/(www\.)?threads\.net\//g,
        replacement: "https://www.vxthreads.net/",
      },
      {
        id: "convertReddit",
        regex: /https:\/\/(www\.|new\.)?reddit\.com\//g,
        replacement: "https://www.rxddit.com/",
      },
      {
        id: "convertPixiv",
        regex: /https:\/\/(www\.)?pixiv.net\//g,
        replacement: "https://phixiv.net/",
      },
      {
        id: "convertDeviantArt",
        regex: /https:\/\/(www\.)?deviantart.com\//g,
        replacement: "https://www.fxdeviantart.com/",
      },
    ];

    this.defaultConfig = this.conversionRules.map((rule) => ({
      type: "switch",
      id: rule.id,
      note: `Convert ${rule.id.replace("convert", "")} links from original to ${
        rule.replacement.match(/https?:\/\/(www\.)?([^\/]+)/)[2]
      } format`,
      value: true,
    }));
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
        this.conversionRules.forEach((rule) => {
          if (this.settings[rule.id]) {
            message.content = message.content.replace(
              rule.regex,
              rule.replacement
            );
          }
        });
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
        if (props[0].parsedMessage && props[0].parsedMessage.content) {
          this.conversionRules.forEach((rule) => {
            if (this.settings[rule.id]) {
              props[0].parsedMessage.content =
                props[0].parsedMessage.content.replace(
                  rule.regex,
                  rule.replacement
                );
            }
          });
        }
      }
    );
  }

  getSettingsPanel() {
    const panel = document.createElement("div");
    panel.style.padding = "20px";

    const settingsGrid = document.createElement("div");
    settingsGrid.style.display = "grid";
    settingsGrid.style.gridTemplateColumns = "repeat(2, 1fr)";
    settingsGrid.style.gap = "20px";

    this.defaultConfig.forEach((setting) => {
      if (setting.type === "switch") {
        const switchElement = this.createToggle(
          setting.id.replace("convert", ""),
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
        settingsGrid.appendChild(switchElement);
        switchElement.querySelector(".toggle-note").style.color = "#FFFFFF";
      }
    });

    panel.appendChild(settingsGrid);
    return panel;
  }

  createToggle(name, note, isChecked, onChange) {
    const toggleContainer = document.createElement("div");
    toggleContainer.className = "toggle-container";
    toggleContainer.style.display = "flex";
    toggleContainer.style.alignItems = "center";
    toggleContainer.style.marginBottom = "10px";

    const toggleLabel = document.createElement("label");
    toggleLabel.className = "toggle";
    toggleLabel.style.marginRight = "10px";
    toggleContainer.appendChild(toggleLabel);

    const toggleInput = document.createElement("input");
    toggleInput.type = "checkbox";
    toggleInput.checked = isChecked;
    toggleInput.onchange = (e) => onChange(e.target.checked);
    toggleLabel.appendChild(toggleInput);

    const toggleSlider = document.createElement("span");
    toggleSlider.className = "slider round";
    toggleLabel.appendChild(toggleSlider);

    const toggleInfoContainer = document.createElement("div");
    toggleInfoContainer.style.display = "flex";
    toggleInfoContainer.style.flexDirection = "column";
    toggleContainer.appendChild(toggleInfoContainer);

    const toggleName = document.createElement("span");
    toggleName.className = "toggle-name";
    toggleName.textContent = name;
    toggleName.style.fontWeight = "bold";
    toggleName.style.marginBottom = "5px";
    toggleInfoContainer.appendChild(toggleName);

    const toggleNote = document.createElement("div");
    toggleNote.className = "toggle-note";
    toggleNote.textContent = note;
    toggleNote.style.fontSize = "12px";
    toggleInfoContainer.appendChild(toggleNote);

    return toggleContainer;
  }
}

module.exports = SocialMediaLinkConverter;
