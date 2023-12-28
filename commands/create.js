import Discord from "discord.js";

export default {
    name: "create",
    description: "Permet de créer des objectifs",
    permission: "Aucune",
    dm: false,
    category: "Objectif",
    options: [
        {
            type: "number",
            name: "nombre",
            description: "Le nombre totale à atteindre dans l'exercice !",
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
        let total = 0;
        let exercise = args.getString("exercice");

        if (!exercise) return message.reply("Merci de renseigner un exercice !");
        if (!bot.exercises.includes(exercise)) return message.reply("Cet exercice n'est pas présent dans les exercices choisis !");

        let number = args.getNumber("nombre");
        if (parseInt(number) <= 0) return message.reply(`Tu ne peux pas ajouter ce nombre de ${exercise}`);

        db.query(`SELECT * FROM objectif WHERE guild = '${message.guildId}' AND exercises = '${exercise}'`, async (err, req1) => {            
            db.query(`SELECT * FROM exercises_history WHERE guild = '${message.guildId}' AND exercises = '${exercise}'`, async (err, req2) => {
                if (req1.length > 1) {
                    await message.reply(`Il y a déjà un objectif de ${req1[0].total_amount} ${exercise}`);
                }
                else if (req2.length < 1) {
                    await message.reply(`Personne n'a réalisé de ${exercise}`);
                }
                req2.forEach(async res => {
                    total += parseInt(res.total_amount)
                })
                if (total >= number) {
                    await message.reply(`L'objectif est déjà atteint pour les ${exercise}`);
                } else {
                    await message.reply(`Tu as bien ajouté un objectif de ${number} ${exercise} !`);
                    db.query(`INSERT INTO objectif (guild, exercises, count, date) VALUES ('${message.guild.id}', '${exercise}', '${number}', '${Date.now()}')`)
                }

            })
        })
    }
}