const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Changes the music volume.')
        .addIntegerOption(option =>
            option.setName('volume')
                .setDescription('The volume to set (0-100).')
                .setRequired(true)),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) {
            return interaction.reply({ content: 'There is no music playing.', ephemeral: true });
        }

        const volume = interaction.options.getInteger('volume');
        if (volume < 0 || volume > 100) {
            return interaction.reply({ content: 'Volume must be between 0 and 100.', ephemeral: true });
        }

        queue.setVolume(volume);
        await interaction.reply({ content: `Volume set to ${volume}%.` });
    },
};
