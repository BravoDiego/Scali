import Discord from "discord.js";
import { createCanvas, loadImage } from 'canvas';

export default {
    name: "rank",
    description: "Affiche le rang d'un membre d'un exercice",
    permission: "Aucune",
    dm: false,
    category: "Exercice",
    options: [
        {
            type: "string",
            name: "exercice",
            description: "Le type d'exercice !",
            required: true,
            autocomplete: true,
        },
        {
            type: "user",
            name: "membre",
            description: "Le rang d'un membre",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args, db) {
        let user;
        if (args.getUser("membre")) {
            user = args.getUser("membre");
            if (!user || !message.guild.members.cache.get(user?.id)) return message.reply("Pas de membre !")
        } else user = message.user;

        let exercise = args.getString("exercice");
        if (!exercise) await message.reply("Merci de renseigner un exercice !");
        if (!bot.exercises.includes(exercise)) return message.reply("Cet exercice n'est pas présent dans les exercices choisis !");

        db.query(`SELECT * FROM exercises_history WHERE guild = '${message.guildId}' AND user = '${user.id}' AND exercises = '${exercise}'`, async (err, req) => {

            db.query(`SELECT * FROM exercises_history WHERE guild = '${message.guildId}' AND exercises = '${exercise}'`, async (err, all) => {

                if (req.length < 1) return message.reply(`Ce membre n'a pas réalisé de ${exercise}`);

                await message.deferReply();

                let color_map = {"online": "#3ba55c", "idle": "#faa61a", "dnd": "#ED4245", "offline": "#99AAb5", "stream": "#593695"}
                let member = message.guild.members.cache.get(user.id);
                let status = member ? member.presence ? member.presence.status : "offline" : "offline";;
                let color_status = color_map[status];

                // info useful
                let leaderboard = all.sort((a, b) => {return (parseInt(b.total_amount)) - (parseInt(a.total_amount))});
                // console.log(leaderboard);
                let total = parseInt(req[0].total_amount);
                let rank = leaderboard.findIndex(r => r.user === user.id) + 1;
                if (rank === 1) {
                    rank = "1er"
                } else {
                    rank = `${rank}eme`
                }

                const canvas = createCanvas(800, 300);
                const ctx = canvas.getContext("2d");

                // background Image
                const background = await loadImage("Assets/background.jpg");
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                
                // Rect with loaw opacity
                ctx.beginPath();
                ctx.fillStyle = "#000000";
                ctx.globalAlpha = 0.5;
                ctx.moveTo(40 + 15, 30);
                ctx.arcTo(40 + 710, 30, 40 + 710, 30 + 240, 15);
                ctx.arcTo(40 + 710, 30 + 240, 40, 30 + 240, 15);
                ctx.arcTo(40, 30 + 240, 40, 30, 15);
                ctx.arcTo(40, 30, 40 + 710, 30, 15);
                ctx.closePath();
                ctx.fill();
                ctx.globalAlpha = 1;

                // Texts

                // User
                let text_member = member.displayName;
                let fontSize = 46;
                let fontStyle = "sans-serif"
                if (text_member.length > 10) {
                    fontSize = 30;
                }
                ctx.fillStyle = "#ffffff";
                ctx.font = `${fontSize}px ${fontStyle}`
                ctx.fillText(text_member, canvas.width / 2.5, canvas.height / 3.5);

                // Tag
                fontSize = fontSize * 0.65;
                ctx.fillStyle = "#ffffff";
                ctx.font = `italic ${fontSize}px ${fontStyle}`
                ctx.fillText(member.user.username, canvas.width / 2.5, canvas.height / 2.3);

                // Nb of exercise
                fontSize = 35
                ctx.fillStyle = "#ffffff";
                ctx.font = `${fontSize}px ${fontStyle}`
                ctx.fillText(`${total} ${exercise} réalisés !`, canvas.width / 2.5, canvas.height / 1.6);

                // Ranks
                fontSize = 35
                ctx.fillStyle = "#ffffff";
                ctx.font = `bold ${fontSize}px ${fontStyle}`
                ctx.fillText(`Rang : ${rank}`, canvas.width / 2.5, canvas.height / 1.2);
                
                // Round status
                ctx.beginPath();
                ctx.arc(160, 150, 108, 0, 2 * Math.PI, true);
                ctx.closePath();
                ctx.fillStyle = color_status;
                ctx.fill();

                // Round-up Avatar
                ctx.beginPath();
                ctx.arc(160, 150, 100, 0, 2 * Math.PI, true);
                ctx.closePath();
                ctx.clip();

                // Add Avatar's image
                const avatar = await loadImage(user.displayAvatarURL({extension: 'png'}));
                ctx.drawImage(avatar, 60, 50, 200, 200);

                
                await message.followUp({files: [new Discord.AttachmentBuilder(await canvas.toBuffer(), {name: `${user}\'s_rank in ${exercise}.png`})]});
            })

        })
    }
}