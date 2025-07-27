const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Warn = require('../../database/models/Warn');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warns a user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to warn.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the warning.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');

        const newWarn = new Warn({
            userId: target.id,
            guildId: interaction.guild.id,
            moderatorId: interaction.user.id,
            reason: reason,
        });

        await newWarn.save();

        await interaction.reply(`Warned ${target.username} for: ${reason}`);
    },
};
