import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function CustomerProfileSkeleton() {
    return (
        <div className="max-w-3xl mx-auto mt-12">
            <Skeleton height={120} width={120} circle className="mb-4" />
            <Skeleton height={32} width={200} className="mb-2" />
            <Skeleton height={20} width={300} className="mb-6" />
            <Skeleton height={32} width={180} className="mb-4" />
            <Skeleton count={3} height={60} className="mb-2" />
        </div>
    )
}