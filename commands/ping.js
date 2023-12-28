export default {
    name: "ping",
    description: "Affiche la latence",
    permission: "Aucune",
    dm: true,
    category: "Information",
    // options: [],
    async run(bot, message, args) {

        await message.reply(`Ping : \`${bot.ws.ping}\``);
    }
}