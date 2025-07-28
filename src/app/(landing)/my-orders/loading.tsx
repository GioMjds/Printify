import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
    return (
        <section className="w-full min-h-screen py-6 md:py-10 mt-16 md:mt-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-r from-bg-primary to-bg-secondary relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-0 left-0 w-48 sm:w-60 md:w-72 h-48 sm:h-60 md:h-72 bg-bg-accent/20 rounded-full blur-xl sm:blur-2xl md:blur-3xl z-0" />
            <div className="absolute bottom-0 right-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-bg-highlight/15 rounded-full blur-xl sm:blur-2xl md:blur-3xl z-0" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, idx) => (
                        <div
                            key={idx}
                            className="glass-card p-4 sm:p-5 md:p-6 flex flex-col gap-3 sm:gap-4 border border-border-light shadow-md"
                        >
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                <Skeleton width={70} height={20} className="opacity-15" />
                                <Skeleton width={70} height={14} className="ml-auto opacity-15" />
                            </div>
                            <div className="flex-1 flex flex-col gap-1 sm:gap-2">
                                <Skeleton height={18} count={2} className="opacity-15" />
                            </div>
                            <div className="mt-2 sm:mt-4">
                                <Skeleton width={70} height={16} className="opacity-15" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}