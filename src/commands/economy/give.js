const { SlashCommandBuilder } = require('discord.js');
const Economy = require('../../database/models/Economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Gives coins to another user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to give coins to.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of coins to give.')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const amount = interaction.options.getInteger('amount');

        if (amount <= 0) {
            return interaction.reply({ content: 'You must give a positive amount of coins.', ephemeral: true });
        }

        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        let userEconomy = await Economy.findOne({ userId, guildId });
        let targetEconomy = await Economy.findOne({ userId: target.id, guildId });

        if (!userEconomy || userEconomy.balance < amount) {
            return interaction.reply({ content: 'You do not have enough coins to make this transaction.', ephemeral: true });
        }

        if (!targetEconomy) {
            targetEconomy = new Economy({ userId: target.id, guildId });
        }

        userEconomy.balance -= amount;
        targetEconomy.balance += amount;

        await userEconomy.save();
        await targetEconomy.save();

        await interaction.reply({ content: `You gave ${amount} coins to ${target.username}.` });
    },
};
