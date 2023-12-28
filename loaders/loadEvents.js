import fs from "fs"

export default async bot => {
    fs.readdirSync("./events").filter(f => f.endsWith(".js")).forEach(async file => {
        const { default: event } = await import(`../events/${file}`);
        bot.on(file.split(".js").join(""), event.bind(null, bot));
        // console.log(`Evenements ${file} chargé avec succès !`)
    });
}