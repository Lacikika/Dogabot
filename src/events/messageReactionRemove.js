const { Events } = require('discord.js');
const ReactionRole = require('../database/models/ReactionRole');

module.exports = {
    name: Events.MessageReactionRemove,
    async execute(reaction, user) {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                return;
            }
        }

        if (user.bot) return;

        const reactionRole = await ReactionRole.findOne({
            guildId: reaction.message.guild.id,
            messageId: reaction.message.id,
            emoji: reaction.emoji.name,
        });

        if (!reactionRole) return;

        const role = reaction.message.guild.roles.cache.get(reactionRole.roleId);
        if (!role) return;

        const member = await reaction.message.guild.members.fetch(user.id);
        if (!member) return;

        await member.roles.remove(role);
    },
};
