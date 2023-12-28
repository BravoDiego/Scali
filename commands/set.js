export default {
    name: "set",
    description: "Set le nombre renseigné au compteur de l'exercice d'un membre",
    permission: "Aucune",
    dm: false,
    category: "Exercice",
    options: [
        {
            type: "number",
            name: "nombre",
            description: "Le nombre totale d'exercice réalisé (nombre de pompes) !",
            required: true,
            autocomplete: false,
        },
        {
            type: "user",
            name: "membre",
            description: "Un membre",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "exercice",
            description: "Le type d'exercice !",
            required: true,
            autocomplete: true,
        },
        {
            type: "string",
            name: "code",
            description: "Le code pour ajouter des exos à n'importe qui !",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, message, args, db) {
        let code = args.getString("code");
        if (!code || code !== bot.code) return message.reply("Le code saisi n'est pas le bon !");

        let user = args.getUser("membre");
        if (!user || !message.guild.members.cache.get(user?.id)) return message.reply("Pas de membre !");

        let number = args.getNumber("nombre");
        if (parseInt(number) <= 0) return message.reply(`Tu ne peux pas ajouter ce nombre de ${exercise}`);

        let exercise = args.getString("exercice");
        if (!exercise) await message.reply("Merci de renseigner un exercice !");
        if (!bot.exercises.includes(exercise)) return message.reply("Cet exercice n'est pas présent dans les exercices choisis !");


        await message.reply(`Tu as bien ajouté ${number} ${exercise} au compteur de ${user.displayName}`);

        db.query(`SELECT * FROM exercises_history WHERE guild = '${message.guild.id}' AND user = '${user.id}' AND exercises = '${exercise}'`, async (err, req) => {
            if (req.length < 1) {
                db.query(`INSERT INTO exercises_history (guild, user, exercises, total_amount, last_update) VALUES ('${message.guild.id}', '${user.id}', '${exercise}', '${number}', '${Date.now()}')`)
            } else {
                let total = number + parseInt(req[0].total_amount);
                db.query(`UPDATE exercises_history SET total_amount = '${total}', last_update = '${Date.now()}' WHERE guild = '${message.guildId}' AND user = '${user.id}' AND exercises = '${exercise}'`);
            }
        })

    }
}