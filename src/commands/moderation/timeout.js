const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Times out a user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to time out.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('The duration of the timeout (e.g., 1h, 1d, 1w).')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the timeout.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const durationString = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const duration = ms(durationString);
        if (!duration) {
            return interaction.reply({ content: 'Invalid duration format.', ephemeral: true });
        }

        const member = await interaction.guild.members.fetch(target.id);
        await member.timeout(duration, reason);

        await interaction.reply(`Timed out ${target.username} for ${durationString}. Reason: ${reason}`);
    },
};
