import { NextApiRequest, NextApiResponse } from 'next';
import GuildSettings from '../../../../../../src/database/models/GuildSettings';
import connectDB from '../../../../../../src/database/database';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { guildId } = req.query;

    if (req.method === 'GET') {
        const settings = await GuildSettings.findOne({ guildId });
        res.status(200).json(settings?.leveling);
    } else if (req.method === 'POST') {
        const { enabled } = req.body;

        let settings = await GuildSettings.findOne({ guildId });

        if (!settings) {
            settings = new GuildSettings({
                guildId,
                leveling: {
                    enabled,
                },
            });
        } else {
            settings.leveling.enabled = enabled;
        }

        await settings.save();
        res.status(200).json(settings.leveling);
    }
}
