
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 mt-8 bg-gradient-to-br from-bg-primary to-bg-accent relative overflow-hidden">
            {/* Decorative Blobs (Skeletons for blobs) */}
            <div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl z-0">
                <Skeleton circle height={288} width={288} style={{ opacity: 0.2 }} />
            </div>
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl z-0">
                <Skeleton circle height={384} width={384} style={{ opacity: 0.15 }} />
            </div>
            {/* Centered Skeleton Card */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full flex-1">
                <div className="glass-card p-10 flex flex-col items-center max-w-xl w-full">
                    <Skeleton height={40} width={320} style={{ marginBottom: 24 }} />
                    {/* Simulate dropzone area */}
                    <Skeleton height={120} width={400} style={{ borderRadius: 16, marginBottom: 16 }} />
                    {/* Simulate button */}
                    <Skeleton height={40} width={180} style={{ borderRadius: 8, marginBottom: 8 }} />
                    {/* Simulate label and allowed content */}
                    <Skeleton height={20} width={260} style={{ marginBottom: 6 }} />
                    <Skeleton height={16} width={220} />
                </div>
            </div>
        </main>
    );
}