/**
 * @name SocialMediaLinkConverter
 * @displayName SocialMediaLinkConverter
 * @version 0.1.2
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
        version: '0.1.2',
        donate: 'https://ko-fi.com/royriver',
        source: 'https://github.com/RoyRiv3r/SocialMediaLinkConverter.plugin.js',
        updateURL: 'https://raw.githubusercontent.com/RoyRiv3r/SocialMediaLinkConverter.plugin.js/main/SocialMediaLinkConverter.plugin.js',
    },
    changelog: [
        {
            title: '0.1.2',
            type: 'added',
            items: ['Added youtube embed alternatives (can avoid ads)', 'Added missing subreddit regex link.'],
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
                          host: 'https://fxtwitter.com/',
                          customHost: '',
                          editPatchEnabled: true,
                      },
                      tiktok: {
                          enabled: true,
                          host: 'https://www.tiktokez.com/',
                          customHost: '',
                          editPatchEnabled: true,
                      },
                      instagram: {
                          enabled: true,
                          host: 'https://www.instagramez.com/',
                          customHost: '',
                          editPatchEnabled: true,
                      },
                      bsky: {
                          enabled: true,
                          host: 'https://bskyx.app/',
                          customHost: '',
                          editPatchEnabled: true,
                      },
                      threads: {
                          enabled: true,
                          host: 'https://www.fixthreads.net/',
                          customHost: '',
                          editPatchEnabled: true,
                      },
                      reddit: {
                          enabled: true,
                          host: 'https://redditez.com/',
                          customHost: '',
                          editPatchEnabled: true,
                      },
                      pixiv: {
                          enabled: true,
                          host: 'https://phixiv.net/',
                          customHost: '',
                          editPatchEnabled: true,
                      },
                      deviantart: {
                          enabled: true,
                          host: 'https://www.fxdeviantart.com/',
                          customHost: '',
                          editPatchEnabled: true,
                      },
                      twitch: {
                          enabled: true,
                          host: 'https://clips.fxtwitch.tv/',
                          customHost: '',
                          editPatchEnabled: true,
                      },
                      youtube: {
                          enabled: true,
                          host: 'https://yt.cdn.13373333.one/',
                          customHost: '',
                          editPatchEnabled: true,
                      },
                  },
              };

              return class SocialMediaLinkConverter extends Plugin {
                  constructor() {
                      super();
                      this.settings = Utilities.loadData(config.info.name, 'settings', defaultSettings);
                      this.conversionRules = [
                          {
                              id: 'Twitter',
                              regex: /https:\/\/(twitter\.com|x\.com)\/\w+\/status\/\d+/g,
                              replacement: 'https://fxtwitter.com/',
                          },
                          {
                              id: 'Tiktok',
                              regex: /https?:\/\/(?:www\.)?tiktok\.com\/@\w+\/video\/\d+/g,
                              replacement: 'https://www.tiktokez.com/',
                          },
                          {
                              id: 'Instagram',
                              regex: /https?:\/\/www\.instagram\.com\/(?:p|reel|tv)\/[a-zA-Z0-9_-]+/g,
                              replacement: 'https://www.instagramez.com/',
                          },
                          {
                              id: 'Bsky',
                              regex: /https:\/\/bsky\.app\/profile\/[A-Za-z.]+\/post\/\w+/g,
                              replacement: 'https://bskyx.app/',
                          },
                          {
                              id: 'Threads',
                              regex: /https?:\/\/(?:www\.)?threads\.net\//g,
                              replacement: 'https://www.fixthreads.net/',
                          },
                          {
                              id: 'Reddit',
                              regex: /https?:\/\/(?:www\.|old\.|new\.|sh\.)?reddit\.com\/(?:r\/\w+\/comments\/\w+\/[^\/\s]+(?:\/\w+)?|r\/\w+\/s\/\w+)/g,
                              replacement: 'https://redditez.com/',
                          },
                          {
                              id: 'Pixiv',
                              regex: /https?:\/\/(?:www\.)?pixiv\.net\/(?:en\/)?artworks\/\d+/g,
                              replacement: 'https://phixiv.net/',
                          },
                          {
                              id: 'Deviantart',
                              regex: /https?:\/\/(?:www\.)?deviantart\.com\/\w+\/art\/[a-zA-Z0-9_-]+/g,
                              replacement: 'https://www.fxdeviantart.com/',
                          },
                          {
                              id: 'Twitch',
                              regex: /https?:\/\/(?:(?:www\.)?twitch\.tv\/\w+\/clip\/|clips\.twitch\.tv\/)([\w-]+)/g,
                              replacement: 'https://clips.fxtwitch.tv/',
                          },
                          {
                              id: 'Youtube',
                              regex: /^https?:\/\/(?:www\.|music\.|m\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/|watch\/|e\/|live\/)|youtu\.be\/)([^/?&]+)/g,
                              replacement: 'https://yt.cdn.13373333.one/',
                          },
                      ];
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

                      Object.entries(this.settings.platforms).forEach(([platform, { enabled, host, customHost, editPatchEnabled }]) => {
                          if (!enabled || (isEdit && !editPatchEnabled)) return;

                          const conversionRule = rulesByPlatform[platform];
                          if (!conversionRule) {
                              Logger.log(`No conversion rule found for ${platform}`);
                              return;
                          }

                          try {
                              const replacementHost = new URL(host.toLowerCase() === 'custom' ? customHost : host);
                              const oldMessageContent = message.content;
                              if (platform === 'youtube') {
                                  message.content = message.content.replace(conversionRule.regex, (match, videoId) => {
                                      if (videoId === 'e') {
                                          const actualVideoId = match.split('/').pop();
                                          return `${replacementHost.origin}/watch?v=${actualVideoId}&dearrow`;
                                      }
                                      return `${replacementHost.origin}/watch?v=${videoId}&dearrow`;
                                  });
                              } else if (platform === 'twitch') {
                                  message.content = message.content.replace(conversionRule.regex, (match, clipId) => {
                                      return `${replacementHost.origin}/${clipId}`;
                                  });
                              } else {
                                  message.content = message.content.replace(conversionRule.regex, (match) => {
                                      try {
                                          const url = new URL(match);
                                          url.host = replacementHost.host;
                                          url.protocol = replacementHost.protocol;
                                          return url.href;
                                      } catch (error) {
                                          Logger.error(`Error replacing URL for ${platform}: ${error}`);
                                          return match;
                                      }
                                  });
                              }

                              if (oldMessageContent !== message.content) {
                                  Logger.info(`Replacements made for ${platform}: Original: ${oldMessageContent}, New: ${message.content}`);
                              }
                          } catch (error) {
                              Logger.error(`Error processing replacement host for ${platform}: ${error}`);
                          }
                      });

                      return message;
                  }

                  patchSendMessage() {
                      const MessageActions = WebpackModules.getByProps('sendMessage');
                      Patcher.before(MessageActions, 'sendMessage', (_, args) => {
                          const [channelId, message, messageId] = args;
                          args[1] = this._convertLinks(message);
                      });
                  }

                  patchEditMessage() {
                      const MessageActions = WebpackModules.getByProps('editMessage');
                      Patcher.before(MessageActions, 'editMessage', (_, args) => {
                          const [channelId, messageId, message] = args;
                          args[2] = this._convertLinks(message, true);
                      });
                  }

                  patchUploadFiles() {
                      const MessageActions = WebpackModules.getByProps('uploadFiles');
                      Patcher.before(MessageActions, 'uploadFiles', (_, props) => {
                          if (props.length > 0 && props[0].parsedMessage && props[0].parsedMessage.content) {
                              props[0].parsedMessage = this._convertLinks(props[0].parsedMessage);
                          }
                      });
                  }

                  getSettingsPanel() {
                      const panel = new SettingPanel(() => this.saveSettings());

                      const alternativeHosts = {
                          twitter: [{ label: 'Alternative (vxtwitter.com)', value: 'https://vxtwitter.com/' }],
                          tiktok: [{ label: 'Alternative (vxtiktok.com)', value: 'https://www.vxtiktok.com/' }],
                          instagram: [{ label: 'Alternative (ddinstagram.com)', value: 'https://www.ddinstagram.com/' }],
                          reddit: [{ label: 'Alternative (rxddit.com)', value: 'https://rxddit.com/' }],
                          bsky: [{ label: 'Alternative (bsyy.app)', value: 'https://bsyy.app/' }],
                          threads: [{ label: 'Alternative (vxthreads.net)', value: 'https://vxthreads.net/' }],
                          youtube: [{ label: 'Alternative (koutu.be)', value: 'https://koutu.be/' }],
                      };

                      const predefinedHosts = this.conversionRules.reduce((acc, rule) => {
                          const platform = rule.id.toLowerCase();
                          const defaultHost = { label: `Default (${new URL(rule.replacement).host})`, value: rule.replacement };
                          acc[platform] = [defaultHost];

                          if (alternativeHosts[platform]) {
                              acc[platform] = acc[platform].concat(alternativeHosts[platform]);
                          }

                          return acc;
                      }, {});

                      Object.entries(this.settings.platforms).forEach(([platformKey, platformSettings]) => {
                          const group = new SettingGroup(`Convert ${platformKey.charAt(0).toUpperCase() + platformKey.slice(1)} Links`);
                          const hostOptions = predefinedHosts[platformKey].concat([{ label: 'Custom', value: 'custom' }]);

                          group.append(
                              new Switch(
                                  `Enable Conversion`,
                                  `Enable or disable link conversion for ${platformKey}.`,
                                  platformSettings.enabled,
                                  (checked) => {
                                      platformSettings.enabled = checked;
                                      this.saveSettings();
                                  }
                              )
                          );
                          group.append(
                              new Switch(
                                  `Convert on Message Edit`,
                                  `Enable or disable the converting message on edit for ${platformKey}.`,
                                  platformSettings.editPatchEnabled,
                                  (checked) => {
                                      platformSettings.editPatchEnabled = checked;
                                      this.saveSettings();
                                  }
                              )
                          );
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
                              )
                          );
                          group.append(
                              new Textbox(
                                  'Custom Host URL',
                                  'Enter your custom host URL.',
                                  platformSettings.customHost,
                                  (value) => {
                                      platformSettings.customHost = value;

                                      if (value === '' && platformSettings.host === 'custom') {
                                          platformSettings.host = '';
                                      } else if (platformSettings.host === 'custom') {
                                          platformSettings.host = value;
                                      }

                                      this.saveSettings();
                                  },
                                  {
                                      placeholder: 'https://example.com/',
                                  }
                              )
                          );

                          panel.append(group);
                      });

                      return panel.getElement();
                  }

                  saveSettings() {
                      Object.entries(this.settings.platforms).forEach(([platformKey, platformSettings]) => {
                          if (platformSettings.host === platformSettings.customHost && platformSettings.customHost !== '') {
                              platformSettings.host = 'custom';
                          }
                      });
                      Utilities.saveData(config.info.name, 'settings', this.settings);
                  }
              };
          };
          return plugin(Pl, Lib);
      })(global.ZeresPluginLibrary.buildPlugin(config)));

module.exports = __webpack_exports__["default"];
/******/ })()
;