const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays information about the server.'),
    async execute(interaction) {
        const { guild } = interaction;
        const { name, memberCount, ownerId, createdTimestamp } = guild;
        const owner = await guild.members.fetch(ownerId);

        const embed = {
            color: 0x0099ff,
            title: `Server Info: ${name}`,
            fields: [
                {
                    name: 'Owner',
                    value: owner.user.tag,
                    inline: true,
                },
                {
                    name: 'Member Count',
                    value: memberCount.toString(),
                    inline: true,
                },
                {
                    name: 'Created At',
                    value: `<t:${Math.floor(createdTimestamp / 1000)}:R>`,
                    inline: true,
                },
            ],
            thumbnail: {
                url: guild.iconURL(),
            },
        };

        await interaction.reply({ embeds: [embed] });
    },
};
