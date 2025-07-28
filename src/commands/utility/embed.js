const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Creates a custom embed.')
        .addStringOption(option =>
            option.setName('json')
                .setDescription('The JSON for the embed.')
                .setRequired(true)),
    async execute(interaction) {
        const json = interaction.options.getString('json');

        try {
            const embed = JSON.parse(json);
            await interaction.channel.send({ embeds: [embed] });
            await interaction.reply({ content: 'Embed sent!', ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: 'Invalid JSON.', ephemeral: true });
        }
    },
};
