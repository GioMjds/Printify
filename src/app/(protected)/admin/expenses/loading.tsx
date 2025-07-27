
export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
            <p className="mt-4 text-lg text-text-light">Loading...</p>
        </div>
    )
}