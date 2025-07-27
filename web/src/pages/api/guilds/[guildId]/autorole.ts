import { NextApiRequest, NextApiResponse } from 'next';
import AutoRole from '../../../../../../src/database/models/AutoRole';
import connectDB from '../../../../../../src/database/database';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { guildId } = req.query;

    if (req.method === 'GET') {
        const autoRoleSettings = await AutoRole.findOne({ guildId });
        res.status(200).json(autoRoleSettings);
    } else if (req.method === 'POST') {
        const { roleId, enabled } = req.body;

        let autoRoleSettings = await AutoRole.findOne({ guildId });

        if (!autoRoleSettings) {
            autoRoleSettings = new AutoRole({
                guildId,
                roleId,
                enabled,
            });
        } else {
            autoRoleSettings.roleId = roleId;
            autoRoleSettings.enabled = enabled;
        }

        await autoRoleSettings.save();
        res.status(200).json(autoRoleSettings);
    }
}
