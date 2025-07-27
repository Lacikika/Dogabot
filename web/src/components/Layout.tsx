import Link from 'next/link';

export default function Layout({ children }) {
    return (
        <div className="flex">
            <aside className="w-64 h-screen bg-gray-800 text-white">
                <div className="p-4">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>
                <nav>
                    <ul>
                        <li className="p-4 hover:bg-gray-700">
                            <Link href="/dashboard">Servers</Link>
                        </li>
                        <li className="p-4 hover:bg-gray-700">
                            <Link href="/dashboard/123/welcome">Welcome</Link>
                        </li>
                        <li className="p-4 hover:bg-gray-700">
                            <Link href="/dashboard/123/moderation">Moderation</Link>
                        </li>
                        <li className="p-4 hover:bg-gray-700">
                            <Link href="/dashboard/123/leveling">Leveling</Link>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="flex-1 p-4">
                {children}
            </main>
        </div>
    );
}
