import { NextApiRequest, NextApiResponse } from 'next';
import Welcome from '../../../../../../src/database/models/Welcome';
import connectDB from '../../../../../../src/database/database';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { guildId } = req.query;

    if (req.method === 'GET') {
        const welcomeSettings = await Welcome.findOne({ guildId });
        res.status(200).json(welcomeSettings);
    } else if (req.method === 'POST') {
        const { channelId, message, enabled } = req.body;

        let welcomeSettings = await Welcome.findOne({ guildId });

        if (!welcomeSettings) {
            welcomeSettings = new Welcome({
                guildId,
                channelId,
                message,
                enabled,
            });
        } else {
            welcomeSettings.channelId = channelId;
            welcomeSettings.message = message;
            welcomeSettings.enabled = enabled;
        }

        await welcomeSettings.save();
        res.status(200).json(welcomeSettings);
    }
}
