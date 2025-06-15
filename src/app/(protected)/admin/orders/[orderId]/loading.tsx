import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-border-light min-h-[420px]">
                <div className="mb-4">
                    <Skeleton height={36} width={220} baseColor="#E3D095" highlightColor="#fffbe6" style={{ borderRadius: '0.75rem' }} />
                </div>
                <div className="flex flex-col gap-6 flex-1">
                    {[...Array(6)].map((_, i) => (
                        <div className="flex justify-between items-center" key={i}>
                            <Skeleton height={22} width={120} baseColor="#E3D095" />
                            <Skeleton height={22} width={160} baseColor="#E3D095" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}