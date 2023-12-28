import Discord from "discord.js";

export default async (bot, interaction) => {

    if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {
        let entry = interaction.options.getFocused();

        if (interaction.commandName === "help") {
            let choices = bot.commands.filter(cmd => cmd.name.includes(entry));
            await interaction.respond(entry === "" ? bot.commands.map(cmd => ({name: cmd.name, value: cmd.name})) : choices.map(choice => ({name: choice.name, value: choice.name})));
        }
        else if (interaction.commandName === "add" || interaction.commandName === "rank" || interaction.commandName === "set" || interaction.commandName === "leaderboard" || interaction.commandName === "info" || interaction.commandName === "create" || interaction.commandName === "removeobj"|| interaction.commandName === "remove") {
            let choices = bot.exercises.filter(ex => ex.includes(entry));
            await interaction.respond(entry === "" ? bot.exercises.map(ex => ({name: ex, value: ex})) : choices.map(ex => ({name: ex, value: ex})))
        }
    }

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        const { default: command } = await import(`../commands/${interaction.commandName}.js`);
        command.run(bot, interaction, interaction.options, bot.db);
    }
}