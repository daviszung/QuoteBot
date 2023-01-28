import { REST, Routes } from 'discord.js';
import myJSON from './config.json' assert { type: 'json' };

const clientId = myJSON.clientId;
const token = myJSON.token;

// Populate the commands array with commands from the commands directory
const commands = [];

import { quoteCommand } from './commands/quote.js';
commands.push(quoteCommand.quote.toJSON())

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
  catch (error) {
		console.error(error);
	}
})();