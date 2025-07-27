const { SlashCommandBuilder } = require('discord.js');
const Economy = require('../../database/models/Economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription("Shows a user's balance.")
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to show the balance for.')),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;

        let userEconomy = await Economy.findOne({ userId: target.id, guildId: interaction.guild.id });

        if (!userEconomy) {
            userEconomy = new Economy({
                userId: target.id,
                guildId: interaction.guild.id,
            });
            await userEconomy.save();
        }

        const embed = {
            color: 0x0099ff,
            title: `Balance for ${target.username}`,
            fields: [
                {
                    name: 'Balance',
                    value: userEconomy.balance.toString(),
                },
            ],
        };

        await interaction.reply({ embeds: [embed] });
    },
};
