import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Loading() {
    return (
        <div className="min-h-screen bg-[var(--color-bg-white)] p-8">
            <div className="mb-8">
                <Skeleton height={36} width={300} style={{ marginBottom: 8 }} />
                <Skeleton height={20} width={350} />
            </div>
            <div className="overflow-x-auto rounded-lg shadow-md bg-[var(--color-bg-white)]">
                <table className="min-w-full divide-y divide-[var(--color-border-light)]">
                    <thead className="bg-[var(--color-bg-soft)]">
                        <tr>
                            {[...Array(6)].map((_, i) => (
                                <th key={i} className="px-6 py-3">
                                    <Skeleton height={16} width={80} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[var(--color-border-light)]">
                        {[...Array(5)].map((_, rowIdx) => (
                            <tr key={rowIdx}>
                                {[...Array(6)].map((_, colIdx) => (
                                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                                        <Skeleton height={20} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}