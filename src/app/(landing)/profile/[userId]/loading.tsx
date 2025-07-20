import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-r from-bg-primary to-bg-secondary relative overflow-hidden p-4 mt-12">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8">
                {/* Profile Header Loading */}
                <div className="glass-card p-8 mb-8 backdrop-blur-xl">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        {/* Profile Image Skeleton */}
                        <div className="relative">
                            <div className="relative bg-white p-2 rounded-full">
                                <Skeleton
                                    height={160}
                                    width={160}
                                    circle
                                    className="ring-4 ring-white/50 shadow-2xl"
                                />
                            </div>
                        </div>

                        {/* Profile Info Skeleton */}
                        <div className="flex-1 text-center lg:text-left space-y-4">
                            <div>
                                {/* Name with verified badge */}
                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                                    <Skeleton height={48} width={300} />
                                    <Skeleton height={40} width={40} circle />
                                </div>

                                {/* Email */}
                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                                    <Skeleton height={20} width={24} />
                                    <Skeleton height={20} width={250} />
                                </div>

                                {/* Role Badge */}
                                <Skeleton height={48} width={120} className="rounded-full" />
                            </div>
                        </div>

                        {/* Stats Skeleton */}
                        <div className="hidden lg:block">
                            <div className="grid grid-cols-1 gap-4 text-center">
                                <div className="glass-card p-4 rounded-xl">
                                    <Skeleton height={48} width={60} className="mb-2" />
                                    <Skeleton height={16} width={80} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}