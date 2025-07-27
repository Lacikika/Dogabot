const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ReactionRole = require('../../database/models/ReactionRole');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('Sets up a reaction role.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('messageid')
                .setDescription('The ID of the message to add the reaction role to.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('The emoji to use for the reaction role.')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to give when the emoji is reacted to.')
                .setRequired(true)),
    async execute(interaction) {
        const messageId = interaction.options.getString('messageid');
        const emoji = interaction.options.getString('emoji');
        const role = interaction.options.getRole('role');

        const message = await interaction.channel.messages.fetch(messageId);
        if (!message) {
            return interaction.reply({ content: 'Message not found.', ephemeral: true });
        }

        const newReactionRole = new ReactionRole({
            guildId: interaction.guild.id,
            messageId,
            emoji,
            roleId: role.id,
        });

        await newReactionRole.save();
        await message.react(emoji);
        await interaction.reply({ content: `Reaction role created for ${emoji} to give the ${role.name} role.`, ephemeral: true });
    },
};
