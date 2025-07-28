import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { useState } from 'react';

export default function Leave({ guild, leaveSettings }) {
    const router = useRouter();
    const { guildId } = router.query;
    const [channelId, setChannelId] = useState(leaveSettings?.channelId || '');
    const [message, setMessage] = useState(leaveSettings?.message || '{user} has left the server.');
    const [enabled, setEnabled] = useState(leaveSettings?.enabled || false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch(`/api/guilds/${guildId}/leave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ channelId, message, enabled }),
        });
    };

    return (
        <Layout>
            <h1>Leave Settings for {guild.name}</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
                    Enable Leave Message
                </label>
                <br />
                <label>
                    Leave Channel:
                    <input type="text" value={channelId} onChange={(e) => setChannelId(e.target.value)} />
                </label>
                <br />
                <label>
                    Leave Message:
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
                </label>
                <br />
                <button type="submit">Save</button>
            </form>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/api/auth/signin',
                permanent: false,
            },
        };
    }

    const { guildId } = context.params;

    const guildRes = await fetch(`https://discord.com/api/guilds/${guildId}`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        },
    });
    const guild = await guildRes.json();

    const leaveRes = await fetch(`${process.env.NEXTAUTH_URL}/api/guilds/${guildId}/leave`);
    const leaveSettings = await leaveRes.json();

    return {
        props: {
            guild,
            leaveSettings,
        },
    };
};
