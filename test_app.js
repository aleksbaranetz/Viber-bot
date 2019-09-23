const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const RichMediaMessage = require('viber-bot').Message.RichMedia;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
const express = require('express');
const app = express();
const mongoose = require ('mongoose');
const config = require ('config');
const User = require('./model/User');



const bot = new ViberBot ({
    authToken: '4a51760bb727d31c-7a95cf891251f4ca-bcdd8a077492e496',
    name: 'Task bot',
    avatar: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Katze_weiss.png"
});


bot.onConversationStarted( async (userProfile, isSubscribed, context, onFinish) => {

    let user = await User.findOne({user_id: userProfile.id});

    if(!user) {
        let userID = new User({
            user_id: userProfile.id
        });
        await userID.save();
    }


    onFinish(new TextMessage(`Hi, ${userProfile.name}! please click Start to proceed.`, {
        "Type": "keyboard",
        "Revision": 1,
        "Buttons": [
            {
                "Columns": 6,
                "Rows": 2,
                "BgColor": "#006400",
                "ActionType": "reply",
                "ActionBody": "Start",
                "TextHAlign": "center",
                "Text": "<b>Start</b>"
            }
        ]
    }),
  )
 
});

const genderKeybord = {
            "Type": "keyboard",
            "Buttons": [
                {
                    "Columns": 2,
                    "Rows": 2,
                    "BgColor": "#006400",
                    "ActionType": "reply",
                    "ActionBody": "Male",
                    "TextHAlign": "center",
                    "Text": "<b>Male</b>"
                },
                {
                    "Columns": 2,
                    "Rows": 2,
                    "BgColor": "#006400",
                    "ActionType": "reply",
                    "ActionBody": "Female",
                    "TextHAlign": "center",
                    "Text": "<b>Female</b>"
                },
                {
                    "Columns": 2,
                    "Rows": 2,
                    "BgColor": "#006400",
                    "ActionType": "reply",
                    "ActionBody": "Developer",
                    "TextHAlign": "center",
                    "Text": "<b>Developer</b>"
                }
            ]
        }


bot.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {
    
    let user = await User.findOne({user_id: response.userProfile.id});
    console.log(user);
    
    if(message.text == 'Start'& user.first_name == undefined) {

        response.send(new TextMessage('Please enter your first name'));
    } else if (user.first_name == undefined) {

        if(message.text.length > 2) {

            user.first_name = message.text;
            await user.save();
            response.send(new TextMessage('Please enter your last name'));

        } else {
            response.send(new TextMessage('It should be more than two letters'));
        }
    
    } else if(user.last_name == undefined) {

        if(message.text.length > 2) {

            user.last_name = message.text;
            await user.save();
            response.send(new TextMessage('Please enter your gender name', genderKeybord));

        } else {
            response.send(new TextMessage('It should be more than two letters'));
        }

    } else if (user.gender == undefined) {

        user.gender = message.text;

        await user.save();

        response.send(new TextMessage('Please enter your date of birth'));

    } else if (user.birthday == undefined) {

        user.birthday = message.text;

        await user.save();

        response.send(new KeyboardMessage({
            "Type": "keyboard",
            "Buttons": [
                {
                    "Columns": 6,
                    "Rows": 2,
                    "BgColor": "#006400",
                    "ActionType": "reply",
                    "ActionBody": "Confirm",
                    "TextHAlign": "center",
                    "Text": "<b>Confirm</b>"
                }
            ]
        }));
    } else {
        response.send(new TextMessage(`${user.first_name} ${user.last_name} ${user.gender} ${user.birthday}`));
    }
        
    
} );






const db = config.get('mongoURI');

mongoose.connect(db, { 
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('Mongoose is connected'))
    .catch(err => console.log(err));

const port = 3000;
app.use('/viber/webhook', bot.middleware());
app.listen(port, () => {
    console.log(`Application running on port: ${port}`);
app.use('/viber/webhook', bot.middleware());
bot.setWebhook(`https://aec78d5a.ngrok.io/viber/webhook`).catch(error => {
        console.log('Can not set webhook on following server. Is it running?');
      console.error(error);
      process.exit(1);
    });
  });