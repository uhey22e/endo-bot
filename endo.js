/******************************************************************************/
// http server
/******************************************************************************/

var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('Endo-Bot is running now.');
});

app.listen(5000);

/******************************************************************************/

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

controller.hears('調子*', ['direct_mention'], function(bot, message) {
    bot.reply(message, '今起きた');
});

controller.hears('進捗*', ['direct_mention'], function(bot, message) {
    bot.reply(message, 'ダメっすねー');
});

controller.hears('^.*修論.*', ['direct_mention'], function(bot, message) {
    bot.reply(message, '今76ページ');
});

controller.hears('^.*ゲーム.*', ['direct_mention'], function(bot, message) {
    bot.reply(message, 'https://www.gamecity.ne.jp/doax3/');
});

controller.hears('遠藤*', ['ambient'], function(bot, message) {
    bot.reply(message, 'なに？');
    bot.reply(message, 'てかさぁ');
})

controller.hears('')

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
