import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function GuildDashboard({ guild }) {
    const router = useRouter();
    const { guildId } = router.query;

    return (
        <Layout>
            <div>
                <h1>{guild.name}</h1>
                <p>Welcome to the dashboard for {guild.name}.</p>
                <p>Guild ID: {guildId}</p>
            </div>
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

    const res = await fetch(`https://discord.com/api/guilds/${guildId}`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        },
    });

    const guild = await res.json();

    return {
        props: {
            guild,
        },
    };
};
