import { db } from '../database/dbConnection.js';

export const controller = {

  // method that adds a quote to the db
  add: async (req, res, next) => {
    const { guildID, author, quote } = req.body;
    const query = `
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'guild_${guildID}') 
        THEN CREATE TABLE "guild_${guildID}" (id SERIAL PRIMARY KEY, author VARCHAR(255), quote VARCHAR(255));
        END IF;
        INSERT INTO "guild_${guildID}" (author, quote) VALUES('${author}', '${quote}');
      END $$;`;
    try {
      await db.query(query);
    }
    catch (err) {
      console.log('Error: ', err);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
    return next();
  },

  // method that removes a quote from a table in the db
  remove: async (req, res, next) => {
    const { guildID, id } = req.body;
    const query = `DELETE FROM guild_${guildID} WHERE id = ${id};`;
    try {
      const response = await db.query(query);
      res.locals.didRemove = response.rowCount > 0;
    }
    catch (err) {
      console.log('Error: ', err);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
    return next();
  },

  // method that gets a random quote from the db
  random: async (req, res, next) => {
    const guildID = req.body.guildID;
    const query = `SELECT author, quote FROM guild_${guildID} ORDER BY RANDOM() LIMIT 1;`;
    try {
      const response = await db.query(query);
      res.locals.randomQuote = response.rows[0];
    }
    catch (err) {
      console.log('Error: ', err);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
    return next();
  },

  // method that gets the entire list of quotes from the db
  list: async (req, res, next) => {
    const guildID = req.body.guildID;
    const query = `SELECT * FROM guild_${guildID}`;
    try {
      const response = await db.query(query);
      res.locals.list = response.rows;
    }
    catch (err) {
      console.log('Error: ', err);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
    return next();
  }
};
