const { Events } = require('discord.js');
const Level = require('../database/models/Level');
const GuildSettings = require('../database/models/GuildSettings');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        const guildId = message.guild.id;
        const userId = message.author.id;

        const settings = await GuildSettings.findOne({ guildId });
        if (!settings?.leveling?.enabled) return;

        let userLevel = await Level.findOne({ userId, guildId });

        if (!userLevel) {
            userLevel = new Level({
                userId,
                guildId,
            });
        }

        userLevel.xp += 1;

        const requiredXp = 5 * (userLevel.level ** 2) + 50 * userLevel.level + 100;

        if (userLevel.xp >= requiredXp) {
            userLevel.level += 1;
            userLevel.xp = 0;
            message.channel.send(`${message.author.username} has leveled up to level ${userLevel.level}!`);
        }

        await userLevel.save();
    },
};
