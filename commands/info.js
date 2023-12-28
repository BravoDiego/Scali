import Discord from "discord.js";

export default {
    name: "info",
    description: "Affiche les informations sur un exercice",
    permission: "Aucune",
    dm: false,
    category: "Information",
    options: [
        {
            type: "string",
            name: "exercice",
            description: "Le type d'exercice !",
            required: true,
            autocomplete: true,
        }
    ],

    async run(bot, message, args, db) {
        let exercise = args.getString("exercice");
        if (!exercise) await message.reply("Merci de renseigner un exercice !");
        if (!bot.exercises.includes(exercise)) return message.reply("Cet exercice n'est pas présent dans les exercices choisis !");

        db.query(`SELECT * FROM exercises_history WHERE guild = '${message.guildId}' AND exercises = '${exercise}'`, async (err, req) => {
            db.query(`SELECT * FROM objectif WHERE guild = '${message.guildId}' AND exercises = '${exercise}'`, async (err, req2) => {
                if (req.length < 1) return message.reply(`Personne n'a réalisé de ${exercise} !!`)
                let total = 0;
                req.forEach(async res => {
                    total += parseInt(res.total_amount)
                })
                // console.log(total);
                let leaderboard = req.sort((a, b) => {return (parseInt(b.total_amount)) - (parseInt(a.total_amount))});
                //console.log(((leaderboard[0].user)));
                let Embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setAuthor({ name: `${bot.user.displayName}`, iconURL: bot.user.displayAvatarURL({dynamic: true})})
                .setTitle(`Information à propos des ${exercise}`)
                .setThumbnail((message.guild.members.cache.get(leaderboard[0].user)).displayAvatarURL({extension: 'png'}))
                .setDescription(`Au total il y a eu ${total} ${exercise} réalisés !!`)
                .setTimestamp()
                .setFooter({text: `Information - ${exercise}`})
                .addFields({name: `${(message.guild.members.cache.get(leaderboard[0].user)).displayName} en a réalisé le plus`, value: `Il a réalisé un total de ${leaderboard[0].total_amount} ${exercise}`})
            
                if (req2.length >= 1) Embed.addFields({name: "Objectif", value: `L'objectif est de réaliser ${req2[0].count} ${exercise}`});
                await message.reply({embeds: [Embed]});
            })
        });
    }
}