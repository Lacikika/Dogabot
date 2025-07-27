const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Economy = require('../../database/models/Economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eco')
        .setDescription('Manages the economy.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Adds coins to a user.')
                .addUserOption(option =>
                    option.setName('target')
                        .setDescription('The user to add coins to.')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('The amount of coins to add.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Removes coins from a user.')
                .addUserOption(option =>
                    option.setName('target')
                        .setDescription('The user to remove coins from.')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('The amount of coins to remove.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Sets the balance of a user.')
                .addUserOption(option =>
                    option.setName('target')
                        .setDescription('The user to set the balance of.')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('The amount to set the balance to.')
                        .setRequired(true))),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const target = interaction.options.getUser('target');
        const amount = interaction.options.getInteger('amount');

        let targetEconomy = await Economy.findOne({ userId: target.id, guildId: interaction.guild.id });

        if (!targetEconomy) {
            targetEconomy = new Economy({ userId: target.id, guildId: interaction.guild.id });
        }

        if (subcommand === 'add') {
            targetEconomy.balance += amount;
            await targetEconomy.save();
            await interaction.reply({ content: `Added ${amount} coins to ${target.username}.`, ephemeral: true });
        } else if (subcommand === 'remove') {
            targetEconomy.balance -= amount;
            await targetEconomy.save();
            await interaction.reply({ content: `Removed ${amount} coins from ${target.username}.`, ephemeral: true });
        } else if (subcommand === 'set') {
            targetEconomy.balance = amount;
            await targetEconomy.save();
            await interaction.reply({ content: `Set ${target.username}'s balance to ${amount}.`, ephemeral: true });
        }
    },
};
