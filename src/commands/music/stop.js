const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the music and leaves the voice channel.'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) {
            return interaction.reply({ content: 'There is no music playing.', ephemeral: true });
        }

        await queue.stop();
        await interaction.reply({ content: 'Music stopped and I left the voice channel.' });
    },
};
