/**
 * @name SocialMediaLinkConverter
 * @displayName SocialMediaLinkConverter
 * @version 0.1.3
 * @author Nears (RoyRiv3r)
 * @donate https://ko-fi.com/royriver
 * @authorId 196079888791240704
 * @source https://github.com/RoyRiv3r/SocialMediaLinkConverter.plugin.js
 * @updateURL https://raw.githubusercontent.com/RoyRiv3r/SocialMediaLinkConverter.plugin.js/main/SocialMediaLinkConverter.plugin.js
 * @description Improves link embedding for multiple websites (Twitter, Tiktok, Instagram, Bsky, etc.)
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const config = {
    info: {
        name: 'SocialMediaLinkConverter',
        authors: [
            {
                name: 'Nears',
            },
        ],
        description: 'Improves link embedding for multiple websites (Twitter, Tiktok, Instagram, Bsky, etc.)',
        version: '0.1.3',
        donate: 'https://ko-fi.com/royriver',
        source: 'https://github.com/RoyRiv3r/SocialMediaLinkConverter.plugin.js',
        updateURL: 'https://raw.githubusercontent.com/RoyRiv3r/SocialMediaLinkConverter.plugin.js/main/SocialMediaLinkConverter.plugin.js',
    },
    changelog: [
        {
            title: '0.1.3',
            type: 'added',
            items: ['Improved custom URL', 'Added Tumblr host', 'Added new alternative fxtwitch host'],
        },
    ],
    main: 'SocialMediaLinkConverter.plugin.js',
};

class MissingZeresDummy {
    constructor() {
        console.warn(
            'ZeresPluginLibrary is required for this plugin to work. Please install it from https://betterdiscord.app/Download?id=9'
        );
        this.downloadZLibPopup();
    }

    start() {}
    stop() {}

    getDescription() {
        return `The library plugin needed for ${config.info.name} is missing. Please enable this plugin, click the settings icon on the right and click "Download Now" to install it.`;
    }

    getSettingsPanel() {
        const buttonClicker = document.createElement('oggetto');
        buttonClicker.addEventListener('DOMNodeInserted', () => {
            buttonClicker.parentElement.parentElement.parentElement.style.display = 'none';

            const buttonToClick = document.querySelector('.bd-button > div');
            buttonToClick.click();

            this.downloadZLibPopup();
        });

        return buttonClicker;
    }

    async downloadZLib() {
        window.BdApi.UI.showToast('Downloading ZeresPluginLibrary...', {
            type: 'info',
        });

        eval('require')('request').get('https://betterdiscord.app/gh-redirect?id=9', async (err, resp, body) => {
            if (err || !body) return this.downloadZLibErrorPopup();

            if (!body.match(/(?<=version: ").*(?=")/)) {
                console.error('Failed to download ZeresPluginLibrary, this is not the correct content.');
                return this.downloadZLibErrorPopup();
            }

            await this.manageFile(body);
        });
    }

    manageFile(content) {
        this.downloadSuccefulToast();

        new Promise((cb) => {
            eval('require')('fs').writeFile(
                eval('require')('path').join(window.BdApi.Plugins.folder, '0PluginLibrary.plugin.js'),
                content,
                cb
            );
        });
    }

    downloadSuccefulToast() {
        window.BdApi.UI.showToast('Successfully downloaded ZeresPluginLibrary!', {
            type: 'success',
        });
    }

    downloadZLibPopup() {
        window.BdApi.UI.showConfirmationModal(
            'Library Missing',
            `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
            {
                confirmText: 'Download Now',
                cancelText: 'Cancel',
                onConfirm: () => this.downloadZLib(),
            }
        );
    }

    downloadZLibErrorPopup() {
        window.BdApi.UI.showConfirmationModal(
            'Error Downloading',
            `ZeresPluginLibrary download failed. Manually install plugin library from the link below.`,
            {
                confirmText: 'Visit Download Page',
                cancelText: 'Cancel',
                onConfirm: () => eval('require')('electron').shell.openExternal('https://betterdiscord.app/Download?id=9'),
            }
        );
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (!global.ZeresPluginLibrary
    ? MissingZeresDummy
    : (([Pl, Lib]) => {
          const plugin = (Plugin, Library) => {
              const { Patcher, WebpackModules, Utilities, PluginUpdater, Settings, Logger } = Library;
              const { SettingPanel, Switch, SettingGroup, Dropdown, Textbox } = Settings;

              const defaultSettings = {
                  platforms: {
                      twitter: {
                          enabled: true,
                          host: 'https://fxtwitter.com',
                          customTemplate: '',
                          editPatchEnabled: true,
                      },
                      tiktok: {
                          enabled: true,
                          host: 'https://www.tiktokez.com',
                          customTemplate: '',
                          editPatchEnabled: true,
                      },
                      instagram: {
                          enabled: true,
                          host: 'https://www.instagramez.com',
                          customTemplate: '',
                          editPatchEnabled: true,
                      },
                      bsky: {
                          enabled: true,
                          host: 'https://bskyx.app',
                          customTemplate: '',
                          editPatchEnabled: true,
                      },
                      threads: {
                          enabled: true,
                          host: 'https://www.fixthreads.net',
                          customTemplate: '',
                          editPatchEnabled: true,
                      },
                      reddit: {
                          enabled: true,
                          host: 'https://rxddit.com',
                          customTemplate: '',
                          editPatchEnabled: true,
                      },
                      pixiv: {
                          enabled: true,
                          host: 'https://phixiv.net',
                          customTemplate: '',
                          editPatchEnabled: true,
                      },
                      deviantart: {
                          enabled: true,
                          host: 'https://www.fixdeviantart.com',
                          customTemplate: '',
                          editPatchEnabled: true,
                      },
                      twitch: {
                          enabled: true,
                          host: 'https://clips.fxtwitch.tv',
                          customTemplate: '',
                          editPatchEnabled: true,
                      },
                      youtube: {
                          enabled: true,
                          host: 'https://yt.cdn.13373333.one',
                          customTemplate: '',
                          editPatchEnabled: true,
                      },
                      tumblr: {
                          enabled: true,
                          host: 'https://tpmblr.com',
                          customTemplate: '',
                          editPatchEnabled: true,
                      },
                  },
              };

              const conversionRules = [
                  {
                      id: 'Twitter',
                      regex: /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/([\w\d_]+)\/status\/(\d+)/gi,
                      replacement: 'https://fxtwitter.com',
                      variables: ['username', 'statusId'],
                  },
                  {
                      id: 'Tiktok',
                      regex: /https?:\/\/(?:www\.)?tiktok\.com\/(@[\w.-]+)\/video\/(\d+)/gi,
                      replacement: 'https://www.tiktokez.com',
                      variables: ['username', 'videoId'],
                  },
                  {
                      id: 'Instagram',
                      regex: /https?:\/\/(?:www\.)?instagram\.com\/(p|reel|tv)\/([\w-]+)/gi,
                      replacement: 'https://www.instagramez.com',
                      variables: ['type', 'postId'],
                  },
                  {
                      id: 'Bsky',
                      regex: /https?:\/\/bsky\.app\/profile\/([\w\d_.-]+)\/post\/([\w\d]+)/gi,
                      replacement: 'https://bskyx.app',
                      variables: ['username', 'postId'],
                  },
                  {
                      id: 'Threads',
                      regex: /https?:\/\/www\.threads\.net\/@([\w\d_.-]+)\/post\/([\w\d]+)/gi,
                      replacement: 'https://www.fixthreads.net',
                      variables: ['username', 'postId'],
                  },
                  {
                      id: 'Reddit',
                      regex: /https?:\/\/(?:www\.|old\.|new\.|np\.)?reddit\.com\/r\/([\w\d_]+)(?:\/(comments|s)\/([\w\d]+)(?:\/([\w\d_-]+))?)?/gi,
                      replacement: 'https://rxddit.com',
                      variables: ['subreddit', 'type', 'postId', 'postTitle'],
                  },
                  {
                      id: 'Pixiv',
                      regex: /https?:\/\/(?:www\.)?pixiv\.net\/(?:en\/)?artworks\/(\d+)/gi,
                      replacement: 'https://phixiv.net',
                      variables: ['artworkId'],
                  },
                  {
                      id: 'Deviantart',
                      regex: /https?:\/\/(?:www\.)?deviantart\.com\/([\w\d_-]+)\/art\/([\w\d_-]+)/gi,
                      replacement: 'https://www.fixdeviantart.com',
                      variables: ['username', 'artTitle'],
                  },
                  {
                      id: 'Twitch',
                      regex: /https?:\/\/(?:(?:www\.)?twitch\.tv\/[\w\d_]+\/clip\/|clips\.twitch\.tv\/)([\w\d-]+)/gi,
                      replacement: 'https://clips.fxtwitch.tv',
                      variables: ['clipId'],
                  },
                  {
                      id: 'Youtube',
                      regex: /https?:\/\/(?:www\.|music\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|e\/|live\/)|youtu\.be\/)([\w\d_-]+)/gi,
                      replacement: 'https://yt.cdn.13373333.one',
                      variables: ['videoId'],
                  },
                  {
                      id: 'Tumblr',
                      regex: /https?:\/\/(?:www\.)?(?:tumblr\.com)\/([^\/]+)\/(\d+)(?:\/([^\/?#]+))?|https?:\/\/([^\.]+)\.tumblr\.com\/post\/(\d+)(?:\/([^\/?#]+))?/gi,
                      replacement: 'https://tpmblr.com',
                      variables: ['username', 'postId', 'postTitle'],
                  },
              ];

              return class SocialMediaLinkConverter extends Plugin {
                  constructor() {
                      super();
                      this.settings = Utilities.loadData(config.info.name, 'settings', defaultSettings);
                      this.conversionRules = conversionRules;
                  }

                  onStart() {
                      this.checkForUpdates();
                      this.patchSendMessage();
                      this.patchEditMessage();
                      this.patchUploadFiles();
                  }

                  onStop() {
                      Patcher.unpatchAll();
                  }

                  checkForUpdates() {
                      PluginUpdater.checkForUpdate(config.info.name, config.info.version, config.info.updateURL);
                  }

                  _convertLinks(message, isEdit = false) {
                      const rulesByPlatform = this.conversionRules.reduce((acc, rule) => {
                          acc[rule.id.toLowerCase()] = rule;
                          return acc;
                      }, {});

                      for (const [platform, settings] of Object.entries(this.settings.platforms)) {
                          const { enabled, host, customTemplate, editPatchEnabled } = settings;
                          if (!enabled || (isEdit && !editPatchEnabled)) continue;

                          const conversionRule = rulesByPlatform[platform];
                          if (!conversionRule) {
                              Logger.log(`No conversion rule found for ${platform}`);
                              continue;
                          }

                          try {
                              const oldContent = message.content;
                              const regex = conversionRule.regex;
                              const variablesList = conversionRule.variables;

                              message.content = message.content.replace(regex, (match, ...args) => {
                                  const capturingGroups = args.slice(0, -2);
                                  const variables = {};

                                  if (conversionRule.id === 'Tumblr') {
                                      variables['username'] = capturingGroups[0] || capturingGroups[3] || '';
                                      variables['postId'] = capturingGroups[1] || capturingGroups[4] || '';
                                      variables['postTitle'] = capturingGroups[2] || capturingGroups[5] || '';
                                  } else {
                                      variablesList.forEach((variable, index) => {
                                          variables[variable] = capturingGroups[index] || '';
                                      });
                                  }

                                  const fixedHost = host.replace(/\/+$/, '');

                                  if (host.toLowerCase() === 'custom') {
                                      let customUrl = customTemplate;
                                      for (const [key, value] of Object.entries(variables)) {
                                          customUrl = customUrl.replaceAll(`{{${key}}}`, value);
                                      }
                                      return customUrl;
                                  } else {
                                      switch (platform) {
                                          case 'twitter':
                                              return `${fixedHost}/${variables.username}/status/${variables.statusId}`;
                                          case 'tiktok':
                                              return `${fixedHost}/${variables.username}/video/${variables.videoId}`;
                                          case 'instagram':
                                              return `${fixedHost}/${variables.type}/${variables.postId}`;
                                          case 'bsky':
                                              return `${fixedHost}/profile/${variables.username}/post/${variables.postId}`;
                                          case 'threads':
                                              return `${fixedHost}/@${variables.username}/post/${variables.postId}`;
                                          case 'reddit':
                                              let redditUrl = `${fixedHost}/r/${variables.subreddit}`;
                                              if (variables.postId) {
                                                  redditUrl += `/${variables.type}/${variables.postId}`;
                                                  if (variables.postTitle) {
                                                      redditUrl += `/${variables.postTitle}`;
                                                  }
                                              }
                                              return redditUrl;
                                          case 'pixiv':
                                              return `${fixedHost}/artworks/${variables.artworkId}`;
                                          case 'deviantart':
                                              return `${fixedHost}/${variables.username}/art/${variables.artTitle}`;
                                          case 'twitch':
                                              return `${fixedHost}/${variables.clipId}`;
                                          case 'youtube':
                                              return `${fixedHost}/watch?v=${variables.videoId}&dearrow`;
                                          case 'tumblr':
                                              if (variables.postTitle) {
                                                  return `${fixedHost}/${variables.username}/${variables.postId}/${variables.postTitle}`;
                                              } else {
                                                  return `${fixedHost}/${variables.username}/${variables.postId}`;
                                              }
                                          default:
                                              return match;
                                      }
                                  }
                              });

                              if (oldContent !== message.content) {
                                  Logger.info(`Replacements made for ${platform}: Original: ${oldContent}, New: ${message.content}`);
                              }
                          } catch (error) {
                              Logger.error(`Error processing replacement for ${platform}: ${error}`);
                          }
                      }

                      return message;
                  }

                  patchSendMessage() {
                      const MessageActions = WebpackModules.getByProps('sendMessage');
                      Patcher.before(MessageActions, 'sendMessage', (_, args) => {
                          const [, message] = args;
                          args[1] = this._convertLinks(message);
                      });
                  }

                  patchEditMessage() {
                      const MessageActions = WebpackModules.getByProps('editMessage');
                      Patcher.before(MessageActions, 'editMessage', (_, args) => {
                          const [, , message] = args;
                          args[2] = this._convertLinks(message, true);
                      });
                  }

                  patchUploadFiles() {
                      const MessageActions = WebpackModules.getByProps('uploadFiles');
                      Patcher.before(MessageActions, 'uploadFiles', (_, args) => {
                          const [uploadProps] = args;
                          if (uploadProps.parsedMessage && uploadProps.parsedMessage.content) {
                              uploadProps.parsedMessage = this._convertLinks(uploadProps.parsedMessage);
                          }
                      });
                  }

                  getSettingsPanel() {
                      const panel = new SettingPanel(() => this.saveSettings());

                      const alternativeHosts = {
                          twitter: [{ label: 'Alternative (vxtwitter.com)', value: 'https://vxtwitter.com' }],
                          tiktok: [{ label: 'Alternative (vxtiktok.com)', value: 'https://www.vxtiktok.com' }],
                          instagram: [{ label: 'Alternative (ddinstagram.com)', value: 'https://www.ddinstagram.com' }],
                          reddit: [{ label: 'Alternative (redditez.com)', value: 'https://redditez.com' }],
                          bsky: [{ label: 'Alternative (bsyy.app)', value: 'https://bsyy.app' }],
                          threads: [{ label: 'Alternative (vxthreads.net)', value: 'https://vxthreads.net' }],
                          twitch: [{ label: 'Alternative (fxtwitch.seria.moe)', value: 'https://fxtwitch.seria.moe/clip' }],
                          youtube: [{ label: 'Alternative (koutu.be)', value: 'https://koutu.be' }],
                      };

                      const predefinedHosts = this.conversionRules.reduce((acc, rule) => {
                          const platform = rule.id.toLowerCase();
                          const defaultHost = {
                              label: `Default (${new URL(rule.replacement).host})`,
                              value: rule.replacement,
                          };
                          acc[platform] = [defaultHost];

                          if (alternativeHosts[platform]) {
                              acc[platform] = acc[platform].concat(alternativeHosts[platform]);
                          }

                          return acc;
                      }, {});

                      const placeholderExamples = {
                          twitter: 'https://example.com/{{username}}/status/{{statusId}}',
                          tiktok: 'https://example.com/{{username}}/video/{{videoId}}',
                          instagram: 'https://www.example.com/{{type}}/{{postId}}',
                          bsky: 'https://example.app/profile/{{username}}/post/{{postId}}',
                          threads: 'https://www.example.net/{{username}}/post/{{postId}}',
                          reddit: 'https://example.com/r/{{subreddit}}/{{type}}/{{postId}}/{{postTitle}}',
                          pixiv: 'https://example.net/artworks/{{artworkId}}',
                          deviantart: 'https://www.example.com/{{username}}/art/{{artTitle}}',
                          twitch: 'https://fxtwitch.example.com/clip/{{clipId}}',
                          youtube: 'https://example.com/watch?v={{videoId}}',
                          tumblr: 'https://example.com/{{username}}/{{postId}}/{{postTitle}}',
                      };

                      for (const [platformKey, platformSettings] of Object.entries(this.settings.platforms)) {
                          const conversionRule = this.conversionRules.find((rule) => rule.id.toLowerCase() === platformKey);
                          const group = new SettingGroup(`Convert ${platformKey.charAt(0).toUpperCase() + platformKey.slice(1)} Links`);

                          group.append(
                              new Switch(
                                  `Enable Conversion`,
                                  `Enable or disable link conversion for ${platformKey}.`,
                                  platformSettings.enabled,
                                  (checked) => {
                                      platformSettings.enabled = checked;
                                      this.saveSettings();
                                  }
                              ),
                              new Switch(
                                  `Convert on Message Edit`,
                                  `Enable or disable converting messages on edit for ${platformKey}.`,
                                  platformSettings.editPatchEnabled,
                                  (checked) => {
                                      platformSettings.editPatchEnabled = checked;
                                      this.saveSettings();
                                  }
                              )
                          );

                          const hostOptions = predefinedHosts[platformKey].concat([{ label: 'Custom', value: 'custom' }]);

                          if (!platformSettings.host || !hostOptions.some((option) => option.value === platformSettings.host)) {
                              platformSettings.host = predefinedHosts[platformKey][0].value;
                          }

                          group.append(
                              new Dropdown(
                                  'Host Selection',
                                  "Choose a predefined host or select 'Custom' to enter your own.",
                                  platformSettings.host === 'custom' ? 'custom' : platformSettings.host,
                                  hostOptions,
                                  (selected) => {
                                      platformSettings.host = selected;
                                      this.saveSettings();
                                  }
                              ),
                              new Textbox(
                                  'Custom URL Template',
                                  `Enter your custom URL template. Available variables: ${conversionRule.variables
                                      .map((v) => `{{${v}}}`)
                                      .join(', ')}`,
                                  platformSettings.customTemplate,
                                  (value) => {
                                      platformSettings.customTemplate = value;
                                      if (platformSettings.host === 'custom') {
                                          platformSettings.host = 'custom';
                                      }
                                      this.saveSettings();
                                  },
                                  {
                                      placeholder: placeholderExamples[platformKey] || 'https://example.com/{{variable}}',
                                  }
                              )
                          );

                          panel.append(group);
                      }

                      return panel.getElement();
                  }

                  saveSettings() {
                      Utilities.saveData(config.info.name, 'settings', this.settings);
                  }
              };
          };
          return plugin(Pl, Lib);
      })(global.ZeresPluginLibrary.buildPlugin(config)));

module.exports = __webpack_exports__["default"];
/******/ })()
;
