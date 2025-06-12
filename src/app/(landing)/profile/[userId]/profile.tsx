'use client';

import { fetchCustomerProfile } from "@/services/Customer";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

interface ProfilePageProps {
    userId: string;
}

export default function ProfilePage({ userId }: ProfilePageProps) {
    const { data } = useQuery({
        queryKey: ["profile", userId],
        queryFn: () => fetchCustomerProfile(userId),
        enabled: !!userId,
    });

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start bg-bg-soft py-0 px-0">
            <div className="w-full max-w-5xl mt-0 p-0 bg-white rounded-none shadow-none">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pt-16 px-6">
                    <div className="flex-shrink-0">
                        <Image
                            src={data.profile_image || "/Default_pfp.jpg"}
                            alt="Profile"
                            width={140}
                            height={140}
                            className="rounded-full border-4 border-accent object-cover"
                        />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-4xl font-bold text-primary mb-1">{data.name || "No Name"}</h2>
                        <p className="text-text-light text-lg mb-2">{data.email}</p>
                        <span className="inline-block bg-accent text-white px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                            {data.role}
                        </span>
                    </div>
                </div>
                <div className="px-6 pb-12">
                    <h3 className="text-2xl font-semibold text-primary mb-4">My Print Orders</h3>
                    {data.uploads && data.uploads.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border-light">
                                <thead className="bg-bg-soft">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-text-primary uppercase tracking-wider">File</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-text-primary uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-text-primary uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-text-primary uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-border-light">
                                    {data.uploads.map((upload: any) => (
                                        <tr key={upload.id}>
                                            <td className="px-4 py-2 text-sm text-text-primary">
                                                <a
                                                    href={upload.fileData}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-accent underline"
                                                >
                                                    {upload.filename}
                                                </a>
                                            </td>
                                            <td className="px-4 py-2 text-sm uppercase text-text-primary">{upload.status}</td>
                                            <td className="px-4 py-2 text-sm text-text-primary">{new Date(upload.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-2 text-sm">
                                                <Link href={`/my-orders`} className="text-primary hover:underline">View All Orders</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center text-text-light py-8">No print orders yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
}