import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { useState } from 'react';

export default function Welcome({ guild, welcomeSettings }) {
    const router = useRouter();
    const { guildId } = router.query;
    const [channelId, setChannelId] = useState(welcomeSettings?.channelId || '');
    const [message, setMessage] = useState(welcomeSettings?.message || 'Welcome {user} to {server}!');
    const [enabled, setEnabled] = useState(welcomeSettings?.enabled || false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch(`/api/guilds/${guildId}/welcome`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ channelId, message, enabled }),
        });
    };

    return (
        <Layout>
            <h1>Welcome Settings for {guild.name}</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
                    Enable Welcome Message
                </label>
                <br />
                <label>
                    Welcome Channel:
                    <input type="text" value={channelId} onChange={(e) => setChannelId(e.target.value)} />
                </label>
                <br />
                <label>
                    Welcome Message:
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

    const welcomeRes = await fetch(`${process.env.NEXTAUTH_URL}/api/guilds/${guildId}/welcome`);
    const welcomeSettings = await welcomeRes.json();

    return {
        props: {
            guild,
            welcomeSettings,
        },
    };
};
