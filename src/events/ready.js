const { Events } = require('discord.js');
const Giveaway = require('../database/models/Giveaway');
const Reminder = require('../database/models/Reminder');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        setInterval(async () => {
            const giveaways = await Giveaway.find({ ended: false, endAt: { $lte: new Date() } });

            for (const giveaway of giveaways) {
                giveaway.ended = true;
                await giveaway.save();

                const channel = await client.channels.fetch(giveaway.channelId);
                const message = await channel.messages.fetch(giveaway.messageId);

                const reactions = message.reactions.cache.get('🎉');
                const users = await reactions.users.fetch();
                const validUsers = users.filter(user => !user.bot);

                if (validUsers.size > 0) {
                    const winners = validUsers.random(giveaway.winners).map(user => user.toString());
                    channel.send(`Congratulations ${winners.join(', ')}! You won the **${giveaway.prize}**!`);
                } else {
                    channel.send(`No one entered the giveaway for the **${giveaway.prize}**.`);
                }
            }

            const reminders = await Reminder.find({ remindAt: { $lte: new Date() } });

            for (const reminder of reminders) {
                const user = await client.users.fetch(reminder.userId);
                const channel = await client.channels.fetch(reminder.channelId);
                channel.send(`${user}, here is your reminder: ${reminder.message}`);
                await Reminder.findByIdAndDelete(reminder._id);
            }
        }, 1000);
    },
};
