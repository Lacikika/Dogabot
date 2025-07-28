const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the music.'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) {
            return interaction.reply({ content: 'There is no music playing.', ephemeral: true });
        }

        if (queue.paused) {
            queue.resume();
            return interaction.reply({ content: 'Resumed the music.' });
        }

        queue.pause();
        await interaction.reply({ content: 'Paused the music.' });
    },
};
