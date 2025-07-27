const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the music queue.'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) {
            return interaction.reply({ content: 'There is no music playing.', ephemeral: true });
        }

        const q = queue.songs
            .map((song, i) => `${i === 0 ? 'Playing:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
            .join('\n');

        await interaction.reply({ content: `**Server Queue**\n${q}` });
    },
};
