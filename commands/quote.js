import { SlashCommandBuilder, SlashCommandSubcommandBuilder, EmbedBuilder } from 'discord.js';

const add = new SlashCommandSubcommandBuilder()
  .setName('add')
  .setDescription('Add a new quote to the end of the list of quotes')
  .addStringOption(option => option
    .setName('quote')
    .setDescription('The quote to add')
    .setRequired(true))
  .addStringOption(option => option
    .setName('author')
    .setDescription('the author to add')
    .setRequired(true))

const remove = new SlashCommandSubcommandBuilder()
  .setName('remove')
  .setDescription('Remove a quote from the list of quotes')
  .addStringOption(option => option
    .setName('number')
    .setDescription('the id number of the quote to remove')
    .setRequired(true))

const random = new SlashCommandSubcommandBuilder()
  .setName('random')
  .setDescription('Get a random quote from the list of quotes')

const list = new SlashCommandSubcommandBuilder()
  .setName('list')
  .setDescription('View the full list of quotes')

export const quoteCommand = {
	quote:  new SlashCommandBuilder()
	.setName('quote')
	.setDescription('quote main')
  .addSubcommand(add)
  .addSubcommand(remove)
  .addSubcommand(random)
  .addSubcommand(list)
  ,

	execute: async function executeAddQuote(interaction) {
    const guildID = interaction.guildId;

    switch (interaction.options.getSubcommand()) {
      // add
      case 'add':
        const quote = interaction.options._hoistedOptions[0].value;
        const author = interaction.options._hoistedOptions[1].value;

        const addRes = await fetch('http://localhost:3000/api/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({quote: quote, author: author, guildID: guildID}),
        });

        if (addRes.status === 200) {
          await interaction.reply('Quote Added Successfully!');
        } else {
          await interaction.reply('Error while adding quote');
        };
        break;

      // remove
      case 'remove':
        const id = interaction.options._hoistedOptions[0].value;
        
        let removeRes = await fetch('http://localhost:3000/api/remove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({guildID: guildID, id: id}),
        });

        const status = removeRes.status;
        removeRes = await removeRes.json();

        if (status === 200) {
          await interaction.reply(removeRes === true 
            ? `Quote ${id} removed from list` 
            : `No quote with the id "${id}" exists`);
        } else {
          await interaction.reply('Error while removing quote');
        };
        break;

      //random
      case 'random':
        let randomRes = await fetch('http://localhost:3000/api/random', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({guildID: guildID}),
        });
        randomRes = await randomRes.json()
        await interaction.reply(`"${randomRes.quote}" ||-${randomRes.author}||`)
        break;
      
      // list
      case 'list':
        let listRes = await fetch('http://localhost:3000/api/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({guildID: guildID}),
        });
        
        const quotes = await listRes.json();
        const listEmbed = new EmbedBuilder()
          .setColor('#017cec')
          .setTitle('Quotes')
          .setDescription(`List of your server's quotes:`);

        for (let i = 0; i < quotes.length; i++) {
          listEmbed.addFields({name: `ID: ${quotes[i].id.toString()}`, value: `"${quotes[i].quote}" -${quotes[i].author}`})
        };
        await interaction.reply({embeds: [listEmbed]})
        break;
    }
	},
};
