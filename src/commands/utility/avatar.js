const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription("Displays a user's avatar.")
        .addUserOption(option =>
            option.setName('target')
                .setDescription("The user's avatar to show.")),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;

        const embed = {
            color: 0x0099ff,
            title: `${target.username}'s Avatar`,
            image: {
                url: target.displayAvatarURL({ dynamic: true, size: 4096 }),
            },
        };

        await interaction.reply({ embeds: [embed] });
    },
};
