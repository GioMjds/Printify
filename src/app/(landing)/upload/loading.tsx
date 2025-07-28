import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-6 bg-gradient-to-br from-bg-primary to-bg-accent relative overflow-hidden">
            {/* Decorative Blobs (Skeletons for blobs) */}
            <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full blur-2xl sm:blur-3xl z-0">
                <Skeleton circle height="100%" width="100%" style={{ opacity: 0.2 }} />
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full blur-2xl sm:blur-3xl z-0">
                <Skeleton circle height="100%" width="100%" style={{ opacity: 0.15 }} />
            </div>

            {/* Centered Skeleton Card */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full flex-1">
                <div className="glass-card p-6 sm:p-8 md:p-10 flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-md">
                    <Skeleton height={32} width={240} style={{ marginBottom: "1.5rem" }} />
                    {/* Simulate dropzone area */}
                    <Skeleton height={100} width="100%" style={{ borderRadius: "1rem", marginBottom: "1rem" }} />
                    {/* Simulate button */}
                    <Skeleton height={40} width={160} style={{ borderRadius: "0.5rem", marginBottom: "0.5rem" }} />
                    {/* Simulate label and allowed content */}
                    <Skeleton height={18} width={200} style={{ marginBottom: "0.5rem" }} />
                    <Skeleton height={16} width={180} />
                </div>
            </div>
        </main>
    );
}