import Discord from "discord.js";
import config from "./config.js";
import loadCommands from "./loaders/loadCommands.js";
import loadEvents from "./loaders/loadEvents.js";


const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({intents});

bot.commands = new Discord.Collection();
bot.color = "#a52237";
bot.exercises = ["pompes", "curls-up", "pull ups", "curl"];
bot.code = config.code;
bot.roleSporty = "1189998086408372345"
// console.log(bot.exercise);

bot.deleteWebhook.query


bot.login(config.token);
loadCommands(bot);
loadEvents(bot);
