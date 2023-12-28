import Discord from "discord.js";
import { createCanvas, loadImage } from 'canvas';

export default {
    name: "leaderboard",
    description: "Donne le classement des membres du serveur dans un exercice",
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
        }
    ],

    async run(bot, message, args, db) {
        let exercise = args.getString("exercice");
        if (!exercise) await message.reply("Merci de renseigner un exercice !");
        if (!bot.exercises.includes(exercise)) return message.reply("Cet exercice n'est pas présent dans les exercices choisis !");

        db.query(`SELECT * FROM exercises_history WHERE guild = '${message.guildId}' AND exercises = '${exercise}'`, async (err, req) => {
            if (req.length < 1) return message.reply(`Personne n'a réalisé de ${exercise} !!`)

            await message.deferReply();

            let color_map = {"online": "#3ba55c", "idle": "#faa61a", "dnd": "#ED4245", "offline": "#99AAb5", "stream": "#593695"};
            let fontSize = 46;
            let fontStyle = "sans-serif";
            let member, status, color_status, avatar, text_member, total, rank;


            let leaderboard = req.sort((a, b) => {return (parseInt(b.total_amount)) - (parseInt(a.total_amount))});


            // const canvas = createCanvas(1000, req.length > 10 ? 10 * 240 + 60 : 60 + 240 * req.length);
            const canvas = createCanvas(1280, 700);
            const ctx = canvas.getContext("2d");

            // background Image
            const background = await loadImage("Assets/background_leaderboard.png");
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            //ctx.fillStyle = bot.color;
            //ctx.fillRect(0,0, canvas.width, canvas.height);

            const x = 40;
            const y = 40;
            const largeur = canvas.width - 2 * x;
            const hauteur = canvas.height - 2 * y;
            const rayon = 15;
            const rayon_cercle = 56;

            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.globalAlpha = 0.75;
            ctx.moveTo(x + rayon, y);
            ctx.arcTo(x + largeur, y, x + largeur, y + hauteur, rayon);
            ctx.arcTo(x + largeur, y + hauteur, x, y + hauteur, rayon);
            ctx.arcTo(x, y + hauteur, x, y, rayon);
            ctx.arcTo(x, y, x + largeur, y, rayon);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;

            
            for (let i = 0; i < (req.length >= 10 ? 10: req.length); i++) {
                member = message.guild.members.cache.get(req[i].user);
                status = member ? member.presence ? member.presence.status : "offline" : "offline";;
                color_status = color_map[status];
                avatar = await loadImage(member.displayAvatarURL({extension: 'png'}));

                text_member = member.displayName;
                total = parseInt(req[i].total_amount);
                rank = leaderboard.findIndex(r => r.user === member.id) + 1;
                if (rank === 1) {
                    rank = "1er"
                } else {
                    rank = `${rank}eme`
                }

                fontSize = 30;
                ctx.fillStyle = "#ffffff";
                ctx.font = `bold ${fontSize}px ${fontStyle}`;
                ctx.fillText(`Rang : ${rank}`, 200 + 590 * Math.floor(i / 5), 85 + 122 * (i % 5));
            
                fontSize = 25
                ctx.fillStyle = "#ffffff";
                ctx.font = `${fontSize}px ${fontStyle}`;
                ctx.fillText(text_member, 200 + 590 * Math.floor(i / 5), 115 + 122 * (i % 5));

                fontSize = 30
                ctx.fillStyle = "#ffffff";
                ctx.font = `${fontSize}px ${fontStyle}`
                ctx.fillText(`${total} ${exercise}`, 200 + 590 * Math.floor(i / 5), 150 + 122 * (i % 5));

                ctx.beginPath();
                ctx.arc(50 + rayon_cercle + 590 * Math.floor(i / 5), 50 + rayon_cercle + 122 * (i % 5), rayon_cercle, 0, 2 * Math.PI, true);
                ctx.closePath();
                ctx.fillStyle = color_status;
                ctx.fill();

                ctx.save();
                ctx.beginPath();
                ctx.arc(50 + rayon_cercle + 590 * Math.floor(i / 5), 50 + rayon_cercle + 122 * (i % 5), 50, 0, 2 * Math.PI, true);
                ctx.closePath();
                ctx.clip();

                ctx.drawImage(avatar, 50 + rayon_cercle - 54 + 590 * Math.floor(i / 5), 50 + rayon_cercle - 54 + 122 * (i % 5), 108, 108);
                ctx.restore();
            }
            
            await message.followUp({files: [new Discord.AttachmentBuilder(await canvas.toBuffer(), {name: `Leaderboard in ${exercise}.png`})]});

        })
    }
}