import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10 flex flex-col md:flex-row gap-8 border border-border-light animate-pulse">
            {/* Order Details Skeleton */}
            <div className="flex-1 flex flex-col gap-6 min-w-[400px]">
                <Skeleton height={32} width={180} baseColor="#E3D095" highlightColor="#fffbe6" style={{ borderRadius: '0.75rem', marginBottom: '0.5rem' }} />
                <div className="flex flex-col gap-2">
                    {[...Array(6)].map((_, i) => (
                        <div className="flex justify-between items-center" key={i}>
                            <Skeleton height={20} width={110} baseColor="#E3D095" />
                            <Skeleton height={20} width={140} baseColor="#E3D095" />
                        </div>
                    ))}
                </div>
            </div>
            {/* File Preview Skeleton */}
            <div className="flex-1 flex flex-col gap-2 min-w-[350px]">
                <Skeleton height={600} width="100%" baseColor="#E3D095" style={{ borderRadius: '0.75rem' }} />
            </div>
        </div>
    );
}