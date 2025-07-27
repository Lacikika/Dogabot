const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song.'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) {
            return interaction.reply({ content: 'There is no music playing.', ephemeral: true });
        }

        try {
            const song = await queue.skip();
            await interaction.reply({ content: `Skipped! Now playing:\n${song.name}` });
        } catch (e) {
            await interaction.reply({ content: 'There are no more songs in the queue.' });
        }
    },
};
