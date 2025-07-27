const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Displays information about a user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to get info about.')),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const member = await interaction.guild.members.fetch(target.id);

        const embed = {
            color: 0x0099ff,
            title: `User Info: ${target.username}`,
            fields: [
                {
                    name: 'Username',
                    value: target.tag,
                    inline: true,
                },
                {
                    name: 'ID',
                    value: target.id,
                    inline: true,
                },
                {
                    name: 'Joined At',
                    value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
                    inline: true,
                },
                {
                    name: 'Created At',
                    value: `<t:${Math.floor(target.createdTimestamp / 1000)}:R>`,
                    inline: true,
                },
                {
                    name: 'Roles',
                    value: member.roles.cache.map(role => role.toString()).join(', '),
                },
            ],
            thumbnail: {
                url: target.displayAvatarURL(),
            },
        };

        await interaction.reply({ embeds: [embed] });
    },
};
