# Rosselli Timetable Bot
Very simple experiment to test telegram bot

**NodeJs** server side of the two Bots @Rosselli1A_bot and @Rosselli1B_bot

The first bot expone the timetable of the classroom 1A of the school Rosselli in Turin. From telegram you ask about a specific day, and the bot aswer with the timetable. The second is the same but for the 1B classroom.

Important thing developed in this bot:
- manage two (or more) different bot with a single method
- provide a custom keyboard to the telegram bot user
- use emoij in the bot answer

this bot is deployed on heroku. 
I did't pay for the heroku scheduler add-on, and I don't want to use the trick explained [here](http://mvalipour.github.io/node.js/2015/11/10/build-telegram-bot-nodejs-heroku/), so the bot is very slow because Heroku shuts the web role process down, if no http port is listened from the process within 30 seconds.

But I assure you that it works!!!


 
