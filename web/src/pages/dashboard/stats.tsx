import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

const StatsPage = ({ stats }) => {
    return (
        <div>
            <h1>Bot Stats</h1>
            <p>Guilds: {stats.guilds}</p>
            <p>Users: {stats.users}</p>
        </div>
    );
};

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

    // In a real application, you would fetch these stats from your bot
    const stats = {
        guilds: 100,
        users: 1000,
    };

    return {
        props: {
            session,
            stats,
        },
    };
};

export default StatsPage;
