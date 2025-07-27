import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { useState } from 'react';

export default function AutoRole({ guild, autoRoleSettings }) {
    const router = useRouter();
    const { guildId } = router.query;
    const [roleId, setRoleId] = useState(autoRoleSettings?.roleId || '');
    const [enabled, setEnabled] = useState(autoRoleSettings?.enabled || false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch(`/api/guilds/${guildId}/autorole`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roleId, enabled }),
        });
    };

    return (
        <Layout>
            <h1>Auto Role Settings for {guild.name}</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
                    Enable Auto Role
                </label>
                <br />
                <label>
                    Role:
                    <input type="text" value={roleId} onChange={(e) => setRoleId(e.target.value)} />
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

    const autoRoleRes = await fetch(`${process.env.NEXTAUTH_URL}/api/guilds/${guildId}/autorole`);
    const autoRoleSettings = await autoRoleRes.json();

    return {
        props: {
            guild,
            autoRoleSettings,
        },
    };
};
