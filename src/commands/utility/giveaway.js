const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Giveaway = require('../../database/models/Giveaway');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Manages giveaways.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Creates a giveaway.')
                .addStringOption(option =>
                    option.setName('prize')
                        .setDescription('The prize of the giveaway.')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('duration')
                        .setDescription('The duration of the giveaway (e.g., 1h, 1d, 1w).')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('winners')
                        .setDescription('The number of winners.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('end')
                .setDescription('Ends a giveaway.')
                .addStringOption(option =>
                    option.setName('messageid')
                        .setDescription('The message ID of the giveaway to end.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('reroll')
                .setDescription('Rerolls a giveaway.')
                .addStringOption(option =>
                    option.setName('messageid')
                        .setDescription('The message ID of the giveaway to reroll.')
                        .setRequired(true))),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') {
            const prize = interaction.options.getString('prize');
            const durationString = interaction.options.getString('duration');
            const winners = interaction.options.getInteger('winners');

            const duration = ms(durationString);
            if (!duration) {
                return interaction.reply({ content: 'Invalid duration format.', ephemeral: true });
            }

            const endAt = new Date(Date.now() + duration);

            const embed = {
                color: 0x0099ff,
                title: prize,
                description: `React with 🎉 to enter!\nEnds: <t:${Math.floor(endAt.getTime() / 1000)}:R>\nWinners: ${winners}`,
                timestamp: new Date(),
            };

            const message = await interaction.channel.send({ embeds: [embed] });
            await message.react('🎉');

            const newGiveaway = new Giveaway({
                messageId: message.id,
                channelId: interaction.channel.id,
                guildId: interaction.guild.id,
                prize,
                winners,
                endAt,
            });

            await newGiveaway.save();
            await interaction.reply({ content: 'Giveaway created!', ephemeral: true });
        } else if (subcommand === 'end') {
            const messageId = interaction.options.getString('messageid');
            const giveaway = await Giveaway.findOne({ messageId, ended: false });

            if (!giveaway) {
                return interaction.reply({ content: 'Giveaway not found or already ended.', ephemeral: true });
            }

            giveaway.endAt = new Date();
            await giveaway.save();
            await interaction.reply({ content: 'Giveaway ended.', ephemeral: true });
        } else if (subcommand === 'reroll') {
            const messageId = interaction.options.getString('messageid');
            const giveaway = await Giveaway.findOne({ messageId, ended: true });

            if (!giveaway) {
                return interaction.reply({ content: 'Giveaway not found or not ended yet.', ephemeral: true });
            }

            const channel = await interaction.client.channels.fetch(giveaway.channelId);
            const message = await channel.messages.fetch(giveaway.messageId);

            const reactions = message.reactions.cache.get('🎉');
            const users = await reactions.users.fetch();
            const validUsers = users.filter(user => !user.bot);

            if (validUsers.size > 0) {
                const winners = validUsers.random(giveaway.winners).map(user => user.toString());
                channel.send(`Congratulations ${winners.join(', ')}! You won the **${giveaway.prize}**! (Reroll)`);
            } else {
                channel.send(`No one entered the giveaway for the **${giveaway.prize}**.`);
            }

            await interaction.reply({ content: 'Giveaway rerolled.', ephemeral: true });
        }
    },
};
