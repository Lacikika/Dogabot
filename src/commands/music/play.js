const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song.')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The song to play.')
                .setRequired(true)),
    async execute(interaction) {
        const song = interaction.options.getString('song');
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: 'You must be in a voice channel to play music.', ephemeral: true });
        }

        await interaction.reply({ content: `Searching for ${song}...` });
        await interaction.client.distube.play(voiceChannel, song, {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction,
        });
    },
};
