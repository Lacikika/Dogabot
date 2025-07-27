const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Warn = require('../../database/models/Warn');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('Shows the warnings for a user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to show warnings for.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getUser('target');

        const warnings = await Warn.find({ userId: target.id, guildId: interaction.guild.id });

        if (warnings.length === 0) {
            return interaction.reply({ content: `${target.username} has no warnings.`, ephemeral: true });
        }

        const embed = {
            color: 0x0099ff,
            title: `Warnings for ${target.username}`,
            fields: warnings.map((warn, index) => ({
                name: `Warning ${index + 1}`,
                value: `**Reason:** ${warn.reason}\n**Moderator:** <@${warn.moderatorId}>\n**Date:** ${warn.timestamp.toLocaleDateString()}`,
            })),
        };

        await interaction.reply({ embeds: [embed] });
    },
};
