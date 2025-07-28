const { SlashCommandBuilder } = require('discord.js');
const Economy = require('../../database/models/Economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claims your daily reward.'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        let userEconomy = await Economy.findOne({ userId, guildId });

        if (!userEconomy) {
            userEconomy = new Economy({ userId, guildId });
        }

        const lastDaily = userEconomy.lastDaily;
        const now = new Date();

        if (lastDaily && now.getTime() - lastDaily.getTime() < 86400000) {
            const remaining = new Date(lastDaily.getTime() + 86400000);
            return interaction.reply({ content: `You have already claimed your daily reward. You can claim it again at ${remaining}.`, ephemeral: true });
        }

        const reward = 100;
        userEconomy.balance += reward;
        userEconomy.lastDaily = now;
        await userEconomy.save();

        await interaction.reply({ content: `You have claimed your daily reward of ${reward} coins!` });
    },
};
