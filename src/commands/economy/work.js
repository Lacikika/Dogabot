const { SlashCommandBuilder } = require('discord.js');
const Economy = require('../../database/models/Economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work for some coins.'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        let userEconomy = await Economy.findOne({ userId, guildId });

        if (!userEconomy) {
            userEconomy = new Economy({ userId, guildId });
        }

        const amount = Math.floor(Math.random() * 100) + 1;
        userEconomy.balance += amount;
        await userEconomy.save();

        await interaction.reply({ content: `You worked and earned ${amount} coins!` });
    },
};
