// Import the necessary discord.js classes
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';

// Import the token, client id, and guild id from the JSON file
import myJSON from './config.json' assert { type: 'json' };
const token = myJSON.token;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// initialize a collection as client.commands
client.commands = new Collection();

// import commands and add them to the collection
import { quoteCommand } from './commands/quote.js';
client.commands.set(quoteCommand.quote.name, quoteCommand);

// event listener for interactions
client.on(Events.InteractionCreate, async interaction => {
	// interactions are an instance of the class "CommandInteraction"
	if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
	
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);