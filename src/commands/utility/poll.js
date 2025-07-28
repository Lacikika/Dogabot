const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Creates a poll.')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The question to ask.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('options')
                .setDescription('The poll options, separated by commas.')
                .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const options = interaction.options.getString('options').split(',');

        if (options.length < 2 || options.length > 10) {
            return interaction.reply({ content: 'You must provide between 2 and 10 options.', ephemeral: true });
        }

        const embed = {
            color: 0x0099ff,
            title: question,
            description: options.map((option, i) => `${i + 1}. ${option}`).join('\n'),
        };

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });

        for (let i = 0; i < options.length; i++) {
            await message.react(`${i + 1}️⃣`);
        }
    },
};
