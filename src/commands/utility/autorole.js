const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const AutoRole = require('../../database/models/AutoRole');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autorole')
        .setDescription('Configures the auto role.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Sets the auto role.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to give to new members.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('disable')
                .setDescription('Disables the auto role.')),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'set') {
            const role = interaction.options.getRole('role');

            let autoRole = await AutoRole.findOne({ guildId: interaction.guild.id });

            if (!autoRole) {
                autoRole = new AutoRole({
                    guildId: interaction.guild.id,
                    roleId: role.id,
                });
            } else {
                autoRole.roleId = role.id;
                autoRole.enabled = true;
            }

            await autoRole.save();
            await interaction.reply({ content: `Auto role set to ${role.name}.`, ephemeral: true });
        } else if (subcommand === 'disable') {
            await AutoRole.findOneAndUpdate({ guildId: interaction.guild.id }, { enabled: false });
            await interaction.reply({ content: 'Auto role disabled.', ephemeral: true });
        }
    },
};
