import Discord from "discord.js";

export default {
    name: "removeobj",
    description: "Supprime l'objectif",
    permission: "Aucune",
    dm: false,
    category: "Objectif",
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

        db.query(`SELECT * FROM objectif WHERE guild = '${message.guildId}' AND exercises = '${exercise}'`, async (err, req) => {
            if (req.length < 1) {
                await message.reply(`Il n'y a pas d'objectif pour les ${exercise}.`);
            } else {
                await message.reply(`Tu as bien retiré l'objectif lié aux ${exercise}.`);
                db.query(`DELETE FROM objectif WHERE guild = '${message.guildId}' AND exercises = '${exercise}'`)
            }
        })
    }
}