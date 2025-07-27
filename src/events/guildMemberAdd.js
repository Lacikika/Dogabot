const { Events } = require('discord.js');
const Welcome = require('../database/models/Welcome');
const AutoRole = require('../database/models/AutoRole');
const Canvas = require('canvas');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        // Auto Role
        const autoRole = await AutoRole.findOne({ guildId: member.guild.id });
        if (autoRole && autoRole.enabled) {
            const role = member.guild.roles.cache.get(autoRole.roleId);
            if (role) {
                member.roles.add(role);
            }
        }

        // Welcome Message
        const welcomeSettings = await Welcome.findOne({ guildId: member.guild.id });

        if (!welcomeSettings || !welcomeSettings.enabled) return;

        const channel = member.guild.channels.cache.get(welcomeSettings.channelId);
        if (!channel) return;

        const welcomeMessage = welcomeSettings.message
            .replace('{user}', member.user.tag)
            .replace('{server}', member.guild.name);

        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('https://i.imgur.com/7M02K2s.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = '28px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

        ctx.font = '32px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
        ctx.drawImage(avatar, 25, 25, 200, 200);

        const attachment = {
            attachment: canvas.toBuffer(),
            name: 'welcome-image.png'
        };

        channel.send({ content: welcomeMessage, files: [attachment] });
    },
};
