const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
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



bot.onConversationStarted( (userProfile, isSubscribed, context, onFinish) =>

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
);

let arr = [
    ['Please enter your first name'],
    ['Please enter your last name'],
    
    ['Please enter your gender',
    {
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
],
['Please enter your date of birth'],
[`That's all`,
    {
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
}
]
]

let messages = [];


bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
    if(message.text == 'Confirm') {

        const newUser = new User({
            'first_name': messages[1],
            'last_name': messages[2],
            'gender': messages[3],
            'birthday': messages[4]
        }).save();

        return response.send(new TextMessage(`${messages[1]} ${messages[2]} ${messages[3]} ${messages[4]}`));

    } else {

        response.send(new TextMessage(...arr[0]));
        arr.shift();
        messages.push(message.text);
    }
} );






const db = config.get('mongoURI');

mongoose.connect(db, { 
    useNewUrlParser: true,
    useCreateIndex: true
  })
    .then(() => console.log('Mongoose is connected'))
    .catch(err => console.log(err));


const port = 3000;
app.use('/viber/webhook', bot.middleware());
app.listen(port, () => {
    console.log(`Application running on port: ${port}`);
app.use('/viber/webhook', bot.middleware());
bot.setWebhook(`https://7ca85426.ngrok.io/viber/webhook`).catch(error => {
        console.log('Can not set webhook on following server. Is it running?');
      console.error(error);
      process.exit(1);
    });
  });