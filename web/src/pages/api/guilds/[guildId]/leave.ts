import { NextApiRequest, NextApiResponse } from 'next';
import Leave from '../../../../../../src/database/models/Leave';
import connectDB from '../../../../../../src/database/database';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { guildId } = req.query;

    if (req.method === 'GET') {
        const leaveSettings = await Leave.findOne({ guildId });
        res.status(200).json(leaveSettings);
    } else if (req.method === 'POST') {
        const { channelId, message, enabled } = req.body;

        let leaveSettings = await Leave.findOne({ guildId });

        if (!leaveSettings) {
            leaveSettings = new Leave({
                guildId,
                channelId,
                message,
                enabled,
            });
        } else {
            leaveSettings.channelId = channelId;
            leaveSettings.message = message;
            leaveSettings.enabled = enabled;
        }

        await leaveSettings.save();
        res.status(200).json(leaveSettings);
    }
}
