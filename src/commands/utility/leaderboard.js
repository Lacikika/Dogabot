const { SlashCommandBuilder } = require('discord.js');
const Level = require('../../database/models/Level');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the server leaderboard.'),
    async execute(interaction) {
        const leaderboard = await Level.find({ guildId: interaction.guild.id })
            .sort({ level: -1, xp: -1 })
            .limit(10);

        if (leaderboard.length === 0) {
            return interaction.reply({ content: 'The leaderboard is empty.', ephemeral: true });
        }

        const embed = {
            color: 0x0099ff,
            title: `Leaderboard for ${interaction.guild.name}`,
            fields: await Promise.all(leaderboard.map(async (userLevel, index) => {
                const user = await interaction.client.users.fetch(userLevel.userId);
                return {
                    name: `${index + 1}. ${user.username}`,
                    value: `**Level:** ${userLevel.level}\n**XP:** ${userLevel.xp}`,
                };
            })),
        };

        await interaction.reply({ embeds: [embed] });
    },
};
