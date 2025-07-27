const { Events } = require('discord.js');
const Leave = require('../database/models/Leave');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        const leaveSettings = await Leave.findOne({ guildId: member.guild.id });

        if (!leaveSettings || !leaveSettings.enabled) return;

        const channel = member.guild.channels.cache.get(leaveSettings.channelId);
        if (!channel) return;

        const leaveMessage = leaveSettings.message
            .replace('{user}', member.user.tag)
            .replace('{server}', member.guild.name);

        channel.send(leaveMessage);
    },
};
