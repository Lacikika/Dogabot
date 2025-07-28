const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Welcome = require('../../database/models/Welcome');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Configures the welcome message.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Sets the welcome channel and message.')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to send the welcome message in.')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('The welcome message. Use {user} for the user and {server} for the server.')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('disable')
                .setDescription('Disables the welcome message.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('preview')
                .setDescription('Previews the welcome message.')),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'set') {
            const channel = interaction.options.getChannel('channel');
            const message = interaction.options.getString('message') || 'Welcome {user} to {server}!';

            let welcomeSettings = await Welcome.findOne({ guildId: interaction.guild.id });

            if (!welcomeSettings) {
                welcomeSettings = new Welcome({
                    guildId: interaction.guild.id,
                    channelId: channel.id,
                    message,
                });
            } else {
                welcomeSettings.channelId = channel.id;
                welcomeSettings.message = message;
                welcomeSettings.enabled = true;
            }

            await welcomeSettings.save();
            await interaction.reply({ content: `Welcome message set to channel ${channel} with message: "${message}"`, ephemeral: true });
        } else if (subcommand === 'disable') {
            await Welcome.findOneAndUpdate({ guildId: interaction.guild.id }, { enabled: false });
            await interaction.reply({ content: 'Welcome message disabled.', ephemeral: true });
        } else if (subcommand === 'preview') {
            const welcomeSettings = await Welcome.findOne({ guildId: interaction.guild.id });

            if (!welcomeSettings || !welcomeSettings.enabled) {
                return interaction.reply({ content: 'Welcome message is not configured.', ephemeral: true });
            }

            const welcomeMessage = welcomeSettings.message
                .replace('{user}', interaction.user.tag)
                .replace('{server}', interaction.guild.name);

            await interaction.reply({ content: welcomeMessage });
        }
    },
};
