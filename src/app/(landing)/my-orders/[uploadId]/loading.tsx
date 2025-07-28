import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export default function OrderSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 my-8 sm:my-12 md:my-16">
                <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">
                    {/* Header Skeleton */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-4 sm:p-5 md:p-6">
                        <Skeleton
                            height={28}
                            width={200}
                            baseColor="rgba(255,255,255,0.2)"
                            highlightColor="rgba(255,255,255,0.3)"
                            className="sm:h-8 md:h-9"
                        />
                    </div>

                    <div className="p-4 sm:p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 h-full">
                            {/* Order Information Skeleton */}
                            <div className="space-y-3 sm:space-y-4 md:space-y-5">
                                <div className="space-y-2 sm:space-y-3">
                                    <SkeletonItem />
                                    <SkeletonItem />
                                    <SkeletonItem />
                                    <SkeletonItem />
                                    <SkeletonItem />
                                    <SkeletonItem />
                                </div>
                            </div>

                            {/* File Preview Skeleton */}
                            <div className="flex flex-col mt-4 sm:mt-5 md:mt-6 lg:mt-0">
                                <Skeleton
                                    height={24}
                                    width={120}
                                    className="mb-2 sm:mb-3 md:mb-4"
                                />
                                <div className="bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 flex-1 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] flex items-center justify-center">
                                    <div className="flex flex-col items-center">
                                        <Skeleton
                                            circle
                                            height={48}
                                            width={48}
                                            className="mb-3 sm:mb-4"
                                        />
                                        <Skeleton
                                            height={20}
                                            width={160}
                                            className="mb-3 sm:mb-4"
                                        />
                                        <Skeleton
                                            height={36}
                                            width={120}
                                        />
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
    <div className="flex border-b border-gray-200 pb-2 sm:pb-3">
        <Skeleton
            height={16}
            width={120}
            className="sm:h-5 md:h-6"
        />
        <div className="flex-1 ml-3 sm:ml-4">
            <Skeleton
                height={16}
                className="sm:h-5 md:h-6"
            />
        </div>
    </div>
);