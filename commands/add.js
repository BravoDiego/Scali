export default {
    name: "add",
    description: "Ajoute le nombre renseigné au compteur de l'exercice",
    permission: "Aucune",
    dm: false,
    category: "Exercice",
    options: [
        {
            type: "number",
            name: "nombre",
            description: "Le nombre totale d'exercice réalisés (nombre de pompes) !",
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
        if (!exercise) await message.reply("Merci de renseigner un exercice !");;
        if (!bot.exercises.includes(exercise)) return message.reply("Cet exercice n'est pas présent dans les exercices choisis !");

        let number = args.getNumber("nombre");
        if (parseInt(number) <= 0) return message.reply(`Tu ne peux pas ajouter ce nombre de ${exercise}`);

        await message.reply(`Tu as bien ajouté ${number} ${exercise} à ton compteur`);

        db.query(`SELECT * FROM exercises_history WHERE guild = '${message.guild.id}' AND user = '${message.user.id}' AND exercises = '${exercise}'`, async (err, req) => {
            db.query(`SELECT * FROM exercises_history WHERE guild = '${message.guildId}' AND exercises = '${exercise}'`, async (err, req1) => {
                db.query(`SELECT * FROM objectif WHERE guild = '${message.guildId}' AND exercises = '${exercise}'`, async (err, req2) => {
                        let total = 0;
                        if (req1.length >= 1) {
                            req1.forEach(async res => {
                                total += parseInt(res.total_amount)
                            })
                        }
                        if (req2.length >= 1) {
                            if (total + parseInt(number) >= parseInt(req2[0].count)) {
                                await message.channel.send(`<@&${bot.roleSporty}> Vous venez de réussir l'objectif de ${req2[0].count} ${exercise}`)
                                db.query(`DELETE FROM objectif WHERE guild = '${message.guildId}' AND exercises = '${exercise}'`)
                            }
                        }
                        if (req.length < 1) {
                            db.query(`INSERT INTO exercises_history (guild, user, exercises, total_amount, last_update) VALUES ('${message.guild.id}', '${message.user.id}', '${exercise}', '${number}', '${Date.now()}')`)
                        } else {
                            let total = number + parseInt(req[0].total_amount);
                            db.query(`UPDATE exercises_history SET total_amount = '${total}', last_update = '${Date.now()}' WHERE guild = '${message.guildId}' AND user = '${message.user.id}' AND exercises = '${exercise}'`);
                        }
                    })
                })
        })

    }
}