const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmutes a user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to unmute.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getUser('target');

        const member = await interaction.guild.members.fetch(target.id);
        await member.timeout(null);

        await interaction.reply(`Unmuted ${target.username}.`);
    },
};
