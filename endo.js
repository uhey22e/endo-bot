/******************************************************************************/
// initial settings
/******************************************************************************/

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

/******************************************************************************/

controller.hears(['調子'], ['direct_mention','direct_message','mention'], function(bot, message) {
    bot.reply(message, '今起きた');
});

controller.hears(['進捗'], 'direct_mention,direct_message,mention', function(bot, message) {
    bot.reply(message, 'ダメっすねー');
});

controller.hears(['修論'], ['direct_mention','direct_message','mention'], function(bot, message) {
    var rand = Math.floor(Math.random() * 40) + 60;

    if (rand < 70) {
        bot.reply(message, 'まだ' + rand + 'ページっすね…');
    } else if (rand < 90) {
        bot.reply(message, '今' + rand + 'ページ');
    } else {
        bot.reply(message, rand + 'ページまで書いたぞ!!');
    }
});

controller.hears(['ゲーム'], ['direct_mention','direct_message','mention'], function(bot, message) {
    var games = ['doax3/', 'zelda-3ds/', 'smusou7e/'];
    var random = games[Math.floor(Math.random() * games.length)];
    bot.reply(message, 'これなんてどうすか');
    bot.reply(message, 'https://www.gamecity.ne.jp/' + random);
});

controller.hears(['遠藤'], ['ambient'], function(bot, message) {
    bot.reply(message, 'なに？');
    bot.reply(message, 'てかさぁ，Timaiぃ');
});

controller.hears(['フルハウスのテーマ'], ['ambient','direct_message'], function(bot, message) {
    var msg1 = 'アーアーアーアー　アッーーー！\nウェネバハぺツー　デットビーティー\nユーメーナ　ペーパボーイ　イーベンティービー\nエビウェイユーロー　エビウェーイ\nイザハー　イザハー\nアキーノホン　ホンチュー\nエビウェイユーロー　エビウェイ\nイザ　メイス　サンバニドゥ　ニージュー\nエビウェイユーロー　ゥロシャーペーン ロードノーン\nクライドゥ　ウエイジュー\nトュケピドゥ　オーーン\nエビウェイユー　\nエビウェーユー　オーーン\nドゥビドゥ　バッバダー\n';
    var msg2 = 'https://youtu.be/oz3c4Wyr-uw';
    bot.reply(message, msg1);
    bot.reply(message, msg2);
});

controller.hears(['豆', '豆っち', 'まめ', 'まめっち'], ['ambient','direct_message'], function(bot, message) {
    bot.reply(message, 'はい？');
});

controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});

/******************************************************************************/
// webserver settings
/******************************************************************************/

controller.setupWebserver(process.env.port, (err, webserver) => {
    webserver.get('/', (req, res) => {
        res.send('Endo-Bot is running now.');
    });
    controller.createWebhookEndpoints(webserver);
});
