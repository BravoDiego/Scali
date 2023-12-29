import loadSlashCommands from "../loaders/loadSlashCommands.js";
import loadDatabase from "../loaders/loadDatabase.js";

export default async bot => {
    bot.db = await loadDatabase();
    bot.db.connect(function () {
        console.log("Base de données connectée !");
    });
    
    await loadSlashCommands(bot);
    
    console.log(`${bot.user.tag} est bien en ligne !`);
}