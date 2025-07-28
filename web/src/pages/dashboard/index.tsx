import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import Layout from '../../components/Layout';

export default function Dashboard({ guilds }) {
    return (
        <Layout>
            <div>
                <h1>Select a Server</h1>
                <ul>
                    {guilds.map(guild => (
                        <li key={guild.id}>
                            <a href={`/dashboard/${guild.id}`}>{guild.name}</a>
                        </li>
                    ))}
                </ul>
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

    const res = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    });

    const guilds = await res.json();

    return {
        props: {
            guilds,
        },
    };
};
