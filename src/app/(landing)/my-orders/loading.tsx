import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
    return (
        <section className="w-full min-h-screen py-10 mt-20 px-4 md:px-12 bg-gradient-to-br from-bg-primary to-bg-accent relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-bg-accent/20 rounded-full blur-3xl z-0" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-bg-highlight/15 rounded-full blur-3xl z-0" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, idx) => (
                        <div
                            key={idx}
                            className="glass-card p-6 flex flex-col gap-4 border border-border-light shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Skeleton width={80} height={24} className="opacity-15" />
                                <Skeleton width={80} height={16} className="ml-auto opacity-15" />
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <Skeleton height={24} count={2} className="opacity-15" />
                            </div>
                            <div className="mt-4">
                                <Skeleton width={80} height={20} className="opacity-15" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}