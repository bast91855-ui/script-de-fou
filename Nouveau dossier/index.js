const { Client, Intents, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { readdirSync } = require('fs');

// Ici, on définit notre config de secours directement
const config = {
   token: "MTUyNjE1MDc0NDY4NjcyMzE0NQ.G8gwCd.KZ_wYMtiuh3_WSMAA0T8u9vbJEOMpIYs4oYV8Q",
    statut_name: "EZgen", 
    statut_type: "PLAYING" 
};
const { loadSlashCommands } = require('./events/load-slash.js');

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

client.once('ready', () => {
    console.log(`discord : heroine667`);
    console.log(`Connecté en tant que ${client.user.tag} !`);
    client.user.setActivity(config.statut_name, { type: config.statut_type });
    loadSlashCommands(client);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    try {
        const command = require(`./commandes/${commandName}.js`);
        await command.execute(interaction);
    } catch (error) {
        console.error(`Erreur lors de l'exécution de la commande ${commandName}:`, error);
        await interaction.reply({ content: 'Une erreur est survenue lors du traitement de votre commande.', ephemeral: true });
    }
});


const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
}

client.login(config.bot_token);
