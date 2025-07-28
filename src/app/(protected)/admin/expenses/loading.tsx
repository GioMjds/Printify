import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
    return (
        <div className="min-h-screen p-4 bg-white">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="glass-card p-6 rounded-xl">
                    <Skeleton width={120} height={16} />
                    <Skeleton width={100} height={36} style={{ marginTop: 12 }} />
                </div>
                <div className="glass-card p-6 rounded-xl">
                    <Skeleton width={180} height={16} />
                    <Skeleton width={100} height={36} style={{ marginTop: 12 }} />
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 mb-6 rounded-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Skeleton width={80} height={14} style={{ marginBottom: 8 }} />
                        <Skeleton height={36} />
                    </div>
                    <div>
                        <Skeleton width={60} height={14} style={{ marginBottom: 8 }} />
                        <Skeleton height={36} />
                    </div>
                </div>
            </div>

            {/* Table Skeleton */}
            <div className="glass-card rounded-xl overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            {[...Array(5)].map((_, i) => (
                                <th key={i} className="px-4 py-3">
                                    <Skeleton width={90} height={16} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, rowIdx) => (
                            <tr key={rowIdx} className="border-b border-border-light">
                                {[...Array(5)].map((_, colIdx) => (
                                    <td key={colIdx} className="px-4 py-3">
                                        <Skeleton height={20} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}