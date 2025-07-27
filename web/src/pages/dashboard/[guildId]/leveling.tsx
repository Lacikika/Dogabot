import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { useState } from 'react';

export default function Leveling({ guild, levelingSettings }) {
    const router = useRouter();
    const { guildId } = router.query;
    const [enabled, setEnabled] = useState(levelingSettings?.enabled || false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch(`/api/guilds/${guildId}/leveling`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ enabled }),
        });
    };

    return (
        <Layout>
            <h1>Leveling Settings for {guild.name}</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
                    Enable Leveling System
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

    const levelingRes = await fetch(`${process.env.NEXTAUTH_URL}/api/guilds/${guildId}/leveling`);
    const levelingSettings = await levelingRes.json();

    return {
        props: {
            guild,
            levelingSettings,
        },
    };
};
