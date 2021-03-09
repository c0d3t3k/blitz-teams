
const { BotFrameworkAdapter } = require('botbuilder');

const { BotActivityHandler } = require('./botActivityHandler');

const adapter = new BotFrameworkAdapter({
    appId: process.env.BotId,
    appPassword: process.env.BotPassword
});

const botActivityHandler = new BotActivityHandler();


const messages = async (req,res) => {
    
    adapter.processActivity(req, res, async (context) => {
        // Process bot activity
        await botActivityHandler.run(context);
    });
}

export default messages;