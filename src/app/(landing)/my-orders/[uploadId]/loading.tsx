import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export default function OrderSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
            <div className="container mx-auto p-8 m-16">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header Skeleton */}
                    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] p-6">
                        <Skeleton height={36} width={250} baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.3)" />
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                            {/* Order Information Skeleton */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <SkeletonItem />
                                    <SkeletonItem />
                                    <SkeletonItem />
                                    <SkeletonItem />
                                    <SkeletonItem />
                                    <SkeletonItem />
                                </div>
                            </div>

                            {/* File Preview Skeleton */}
                            <div className="flex flex-col">
                                <Skeleton height={28} width={150} className="mb-4" />
                                <div className="bg-gray-50 rounded-2xl p-4 flex-1 min-h-[600px] flex items-center justify-center">
                                    <div className="flex flex-col items-center">
                                        <Skeleton circle height={64} width={64} className="mb-4" />
                                        <Skeleton height={24} width={200} className="mb-4" />
                                        <Skeleton height={40} width={140} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const SkeletonItem = () => (
    <div className="flex border-b border-gray-200 pb-3">
        <Skeleton width={160} height={20} />
        <div className="flex-1 ml-4">
            <Skeleton height={20} />
        </div>
    </div>
);