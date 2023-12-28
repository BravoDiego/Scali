export default {
    name: "remove",
    description: "Enleve le nombre renseigné au compteur de l'exercice",
    permission: "Aucune",
    dm: false,
    category: "Exercice",
    options: [
        {
            type: "number",
            name: "nombre",
            description: "Le nombre totale d'exercice réalisés à enlever (nombre de pompes) !",
            required: true,
            autocomplete: false,
        },
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

        let number = args.getNumber("nombre");
        if (parseInt(number) <= 0) return message.reply(`Tu ne peux pas ajouter ce nombre de ${exercise}`);
    

        db.query(`SELECT * FROM exercises_history WHERE guild = '${message.guild.id}' AND user = '${message.user.id}' AND exercises = '${exercise}'`, async (err, req) => {
            if (req.length < 1) {
                await message.reply(`Tu n'as pas de ${exercise} à enlever`)
            } else {
                let total = parseInt(req[0].total_amount) - number;
                if (total <= 0) {
                    total = 0;
                    await message.reply(`Tu as bien retiré ${req[0].total_amount} ${exercise} à ton compteur`);
                } else {
                    await message.reply(`Tu as bien retiré ${number} ${exercise} à ton compteur`);
                }
                db.query(`UPDATE exercises_history SET total_amount = '${total}', last_update = '${Date.now()}' WHERE guild = '${message.guildId}' AND user = '${message.user.id}' AND exercises = '${exercise}'`);
            }
        })

    }
}