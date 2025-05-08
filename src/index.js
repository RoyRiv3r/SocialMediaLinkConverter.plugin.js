/**
 * @name SocialMediaLinkConverter2
 * @displayName SocialMediaLinkConverter
 * @version 0.1.6
 * @author Nears (RoyRiv3r)
 * @donate https://ko-fi.com/royriver
 * @authorId 196079888791240704
 * @source https://github.com/RoyRiv3r/SocialMediaLinkConverter.plugin.js
 * @updateURL https://raw.githubusercontent.com/RoyRiv3r/SocialMediaLinkConverter.plugin.js/main/SocialMediaLinkConverter.plugin.js
 * @description Improves link embedding for multiple websites (Twitter, Tiktok, Instagram, Bsky, etc.)
 */

module.exports = (meta) => {
    // -- Destructure -- //
    const { Data, Webpack, Patcher, UI } = BdApi;

    // -- Config -- //
    const config = {
        changelog: [
            {
                title: '0.1.6',
                type: 'improved',
                items: [
                    'Removed dependency on ZeresPluginLibrary',
                    'Now uses native BetterDiscord API',
                    'Fixed settings panel layout and inputs',
                ],
            },
        ],
    };

    // -- Conversion Rules -- //
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
        {
            id: 'Spotify',
            regex: /https?:\/\/(?:open|player)\.spotify\.com\/(?:intl-\w+\/)?track\/([\w\d_-]+)(?:\?.*)?/gi,
            replacement: 'https://open.fxspotify.com',
            variables: ['trackId'],
        },
        {
            id: 'Bilibili',
            regex: /https?:\/\/(?:www\.)?bilibili\.com\/video\/(BV[\w\d]+)/gi,
            replacement: 'https://fxbilibili.seria.moe',
            variables: ['videoId'],
        },
    ];

    // -- Default Settings -- //
    const defaultSettings = {
        platforms: {},
    };

    // Initialize default settings from conversion rules
    conversionRules.forEach((rule) => {
        const platformId = rule.id.toLowerCase();
        defaultSettings.platforms[platformId] = {
            enabled: true,
            host: rule.replacement,
            customTemplate: '',
            editPatchEnabled: true,
        };
    });

    // Settings object
    let settings = {};

    // -- Functions -- //
    function loadSettings() {
        const savedSettings = Data.load(meta.name, 'settings');
        let result = JSON.parse(JSON.stringify(defaultSettings));

        if (savedSettings && savedSettings.platforms) {
            Object.keys(savedSettings.platforms).forEach((platform) => {
                if (result.platforms[platform]) {
                    result.platforms[platform] = Object.assign({}, result.platforms[platform], savedSettings.platforms[platform]);
                }
            });
        }

        settings = result;
        return result;
    }

    function saveSettings() {
        Data.save(meta.name, 'settings', settings);
    }

    function showChangelog() {
        const lastVersion = Data.load(meta.name, 'version');
        if (lastVersion !== meta.version) {
            UI.showChangelogModal({
                title: meta.name,
                subtitle: meta.version,
                changes: config.changelog,
            });
            Data.save(meta.name, 'version', meta.version);
        }
    }

    function convertLinks(message, isEdit = false) {
        const rulesByPlatform = conversionRules.reduce((acc, rule) => {
            acc[rule.id.toLowerCase()] = rule;
            return acc;
        }, {});

        for (const [platform, platformSettings] of Object.entries(settings.platforms)) {
            const { enabled, host, customTemplate, editPatchEnabled } = platformSettings;
            if (!enabled || (isEdit && !editPatchEnabled)) continue;

            const conversionRule = rulesByPlatform[platform];
            if (!conversionRule) {
                console.log(`${meta.name}: No conversion rule found for ${platform}`);
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
                            case 'spotify':
                                return `${fixedHost}/track/${variables.trackId}`;
                            case 'bilibili':
                                return `${fixedHost}/video/${variables.videoId}`;
                            default:
                                return match;
                        }
                    }
                });

                if (oldContent !== message.content) {
                    console.log(`${meta.name}: Replacements made for ${platform}: Original: ${oldContent}, New: ${message.content}`);
                }
            } catch (error) {
                console.error(`${meta.name}: Error processing replacement for ${platform}: ${error}`);
            }
        }

        return message;
    }

    function buildSettingsPanel() {
        const categories = [];

        for (const [platformKey, platformSettings] of Object.entries(settings.platforms)) {
            const platformName = platformKey.charAt(0).toUpperCase() + platformKey.slice(1);
            const platformRule = conversionRules.find((rule) => rule.id.toLowerCase() === platformKey);

            if (!platformRule) continue;

            // Define alternative hosts map
            const alternativeHosts = {
                twitter: [
                    {
                        label: 'Alternative (vxtwitter.com)',
                        value: 'https://vxtwitter.com',
                    },
                ],
                tiktok: [
                    {
                        label: 'Alternative (vxtiktok.com)',
                        value: 'https://www.vxtiktok.com',
                    },
                ],
                instagram: [
                    {
                        label: 'Alternative (ddinstagram.com)',
                        value: 'https://www.ddinstagram.com',
                    },
                ],
                reddit: [
                    {
                        label: 'Alternative (redditez.com)',
                        value: 'https://redditez.com',
                    },
                ],
                bsky: [{ label: 'Alternative (bsyy.app)', value: 'https://bsyy.app' }],
                threads: [
                    {
                        label: 'Alternative (vxthreads.net)',
                        value: 'https://vxthreads.net',
                    },
                ],
                twitch: [
                    {
                        label: 'Alternative (fxtwitch.seria.moe)',
                        value: 'https://fxtwitch.seria.moe/clip',
                    },
                ],
                youtube: [{ label: 'Alternative (koutu.be)', value: 'https://koutu.be' }],
                spotify: [
                    {
                        label: 'Alternative (player.spotify.com)',
                        value: 'https://player.spotify.com',
                    },
                ],
            };

            // Build host options in one go
            const hostOptions = [
                // Default host
                {
                    label: `Default (${new URL(platformRule.replacement).host})`,
                    value: platformRule.replacement,
                },
                // Alternative hosts
                ...(alternativeHosts[platformKey] || []),
                // Custom option
                { label: 'Custom', value: 'custom' },
            ];

            // Template placeholder examples
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
                spotify: 'https://example.com/track/{{trackId}}',
                bilibili: 'https://example.com/video/{{videoId}}',
            };

            // Create the entire category at once with all settings
            categories.push({
                type: 'category',
                id: platformKey,
                name: platformName,
                collapsible: true,
                shown: false,
                settings: [
                    {
                        type: 'switch',
                        id: 'enabled',
                        name: 'Enable Conversion',
                        note: `Enable or disable link conversion for ${platformName}.`,
                        value: platformSettings.enabled,
                    },
                    {
                        type: 'switch',
                        id: 'editPatchEnabled',
                        name: 'Convert on Message Edit',
                        note: `Enable or disable converting messages on edit for ${platformName}.`,
                        value: platformSettings.editPatchEnabled,
                    },
                    {
                        type: 'dropdown',
                        id: 'host',
                        name: 'Host Selection',
                        note: "Choose a predefined host or select 'Custom' to enter your own.",
                        value: platformSettings.host === 'custom' ? 'custom' : platformSettings.host,
                        options: hostOptions,
                    },
                    {
                        type: 'text',
                        id: 'customTemplate',
                        name: 'Custom URL Template',
                        inline: false,
                        note: `Enter your custom URL template. Available variables: ${platformRule.variables
                            .map((v) => `{{${v}}}`)
                            .join(', ')}`,
                        value: platformSettings.customTemplate,
                        placeholder: placeholderExamples[platformKey] || 'https://example.com/{{variable}}',
                    },
                ],
            });
        }

        return categories;
    }

    // -- Main -- //

    // Webpack modules for message sending, editing, and file uploading
    let getMessageModule = () => {
        try {
            const messageProcessingModule = BdApi.Webpack.getByKeys('sendMessage', 'editMessage');

            const fileUploadModule = BdApi.Webpack.getByKeys('uploadFiles');

            if (!messageProcessingModule) {
                console.error(`${meta.name}: Module with 'sendMessage' and 'editMessage' not found using getByKeys.`);
            }
            if (!fileUploadModule) {
                console.error(`${meta.name}: Module with 'uploadFiles' not found using getByKeys.`);
            }

            return {
                sendModule: messageProcessingModule,
                editModule: messageProcessingModule,
                uploadModule: fileUploadModule,
            };
        } catch (err) {
            console.error(`${meta.name}: Error in getMessageModule while searching for modules:`, err);

            return { sendModule: undefined, editModule: undefined, uploadModule: undefined };
        }
    };

    return {
        start() {
            loadSettings();
            showChangelog();

            const { sendModule, editModule, uploadModule } = getMessageModule();

            // Patch sendMessage
            if (sendModule && typeof sendModule.sendMessage === 'function') {
                Patcher.before(meta.name, sendModule, 'sendMessage', (_, args) => {
                    const [, message] = args;
                    if (message && message.content) {
                        args[1] = convertLinks(message);
                    }
                });
            } else {
                console.error(`${meta.name}: Could not find 'sendMessage' function on the identified module or module not found.`);
            }

            // Patch editMessage
            if (editModule && typeof editModule.editMessage === 'function') {
                Patcher.before(meta.name, editModule, 'editMessage', (_, args) => {
                    const [, , message] = args;
                    if (message && message.content) {
                        args[2] = convertLinks(message, true);
                    }
                });
            } else {
                console.error(`${meta.name}: Could not find 'editMessage' function on the identified module or module not found.`);
            }

            // Patch uploadFiles
            if (uploadModule && typeof uploadModule.uploadFiles === 'function') {
                Patcher.before(meta.name, uploadModule, 'uploadFiles', (_, args) => {
                    const [uploadProps] = args;
                    if (uploadProps && uploadProps.parsedMessage && uploadProps.parsedMessage.content) {
                        uploadProps.parsedMessage = convertLinks(uploadProps.parsedMessage);
                    }
                });
            } else {
                console.error(`${meta.name}: Could not find 'uploadFiles' function on the identified module or module not found.`);
            }
        },

        stop() {
            Patcher.unpatchAll(meta.name);
        },

        getSettingsPanel() {
            loadSettings();
            const categories = buildSettingsPanel();

            return UI.buildSettingsPanel({
                settings: categories,
                onChange: (categoryId, settingId, value) => {
                    if (settings.platforms[categoryId]) {
                        settings.platforms[categoryId][settingId] = value;
                        saveSettings();
                    }
                },
            });
        },
    };
};
