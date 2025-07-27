const { SlashCommandBuilder } = require('discord.js');
const Reminder = require('../../database/models/Reminder');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Sets a reminder.')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('The time to wait before reminding you (e.g., 1h, 1d, 1w).')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to remind you of.')
                .setRequired(true)),
    async execute(interaction) {
        const timeString = interaction.options.getString('time');
        const message = interaction.options.getString('message');

        const time = ms(timeString);
        if (!time) {
            return interaction.reply({ content: 'Invalid time format.', ephemeral: true });
        }

        const remindAt = new Date(Date.now() + time);

        const newReminder = new Reminder({
            userId: interaction.user.id,
            channelId: interaction.channel.id,
            message,
            remindAt,
        });

        await newReminder.save();
        await interaction.reply({ content: `I will remind you at ${remindAt}.`, ephemeral: true });
    },
};
