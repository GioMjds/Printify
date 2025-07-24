import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
    return (
        <div className="min-h-screen bg-white p-8">
            <div className="mb-8">
                <Skeleton height={36} width={220} style={{ marginBottom: 8 }} />
                <Skeleton height={20} width={320} />
            </div>
            <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                <table className="min-w-full divide-y divide-border-light table-fixed">
                    <thead className="bg-bg-soft">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                                <Skeleton height={16} width={60} />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                                <Skeleton height={16} width={60} />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                                <Skeleton height={16} width={60} />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-border-light">
                        {[...Array(6)].map((_, i) => (
                            <tr key={i}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                                    <Skeleton height={20} width={120} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                                    <Skeleton height={20} width={180} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                                    <Skeleton height={20} width={80} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}