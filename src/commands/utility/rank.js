const { SlashCommandBuilder } = require('discord.js');
const Level = require('../../database/models/Level');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription("Shows a user's level and XP.")
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to show the rank for.')),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;

        const userLevel = await Level.findOne({ userId: target.id, guildId: interaction.guild.id });

        if (!userLevel) {
            return interaction.reply({ content: `${target.username} has no level yet.`, ephemeral: true });
        }

        const embed = {
            color: 0x0099ff,
            title: `Rank for ${target.username}`,
            fields: [
                {
                    name: 'Level',
                    value: userLevel.level.toString(),
                    inline: true,
                },
                {
                    name: 'XP',
                    value: userLevel.xp.toString(),
                    inline: true,
                },
            ],
        };

        await interaction.reply({ embeds: [embed] });
    },
};
