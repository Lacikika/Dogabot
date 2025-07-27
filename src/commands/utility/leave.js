const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Leave = require('../../database/models/Leave');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Configures the leave message.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Sets the leave channel and message.')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to send the leave message in.')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('The leave message. Use {user} for the user and {server} for the server.')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('disable')
                .setDescription('Disables the leave message.')),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'set') {
            const channel = interaction.options.getChannel('channel');
            const message = interaction.options.getString('message') || '{user} has left the server.';

            let leaveSettings = await Leave.findOne({ guildId: interaction.guild.id });

            if (!leaveSettings) {
                leaveSettings = new Leave({
                    guildId: interaction.guild.id,
                    channelId: channel.id,
                    message,
                });
            } else {
                leaveSettings.channelId = channel.id;
                leaveSettings.message = message;
                leaveSettings.enabled = true;
            }

            await leaveSettings.save();
            await interaction.reply({ content: `Leave message set to channel ${channel} with message: "${message}"`, ephemeral: true });
        } else if (subcommand === 'disable') {
            await Leave.findOneAndUpdate({ guildId: interaction.guild.id }, { enabled: false });
            await interaction.reply({ content: 'Leave message disabled.', ephemeral: true });
        }
    },
};
