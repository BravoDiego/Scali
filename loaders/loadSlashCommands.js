import Discord from "discord.js";
import { REST, Routes } from "discord.js";

export default async bot => {
    let commands = [];

    bot.commands.forEach(async command => {
        let slashCommand = new Discord.SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)
        .setDMPermission(command.dm)
        .setDefaultMemberPermissions(command.permission === "Aucune" ? null: command.permission)

        if (command.options?.length >= 1) {
            for (let i = 0; i < command.options.length; i++) {
                if (command.options[i].type === "string") slashCommand[`add${command.options[i].type.slice(0, 1).toUpperCase() + command.options[i].type.slice(1, command.options[i].type.length)}Option`](option => option.setName(command.options[i].name).setDescription(command.options[i].description).setAutocomplete(command.options[i].autocomplete).setRequired(command.options[i].required))
                else slashCommand[`add${command.options[i].type.slice(0, 1).toUpperCase() + command.options[i].type.slice(1, command.options[i].type.length)}Option`](option => option.setName(command.options[i].name).setDescription(command.options[i].description).setRequired(command.options[i].required))
            }
            // console.log(slashCommand);
        }

        await commands.push(slashCommand.toJSON());
    });
    // console.log(commands);
    const rest = new REST({ version: '10' }).setToken(bot.token);

    await rest.put(Routes.applicationCommands(bot.user.id), { body: commands });
    console.log("Les slashs commandes sont créées avec succès !");
}