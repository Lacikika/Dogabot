const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Deletes a specified number of messages from a channel.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The number of messages to delete.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'You can only delete between 1 and 100 messages at a time.', ephemeral: true });
        }

        await interaction.channel.bulkDelete(amount, true).catch(error => {
            console.error(error);
            interaction.reply({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
        });

        await interaction.reply({ content: `Successfully deleted ${amount} messages.`, ephemeral: true });
    },
};
