import { fetchSinglePrintUpload } from "@/services/Customer";
import { 
    dehydrate, 
    HydrationBoundary, 
    QueryClient 
} from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

const GetSingleOrderPage = dynamic(() => import("./get-single-order"));

export async function generateMetadata({ params }: { params: Promise<{ uploadId: string }> }) {
    try {
        const { uploadId } = await params;
        const data = await fetchSinglePrintUpload({ uploadId: uploadId });

        if (!data || data.error) {
            return {
                title: "Order Not Found"
            };
        }

        return {
            title: data?.orderName ? `Order #${data.orderName}` : "Order Details",
            description: `Details for order #${data.orderName || data.uploadId}`,
        }
    } catch {
        return {
            title: "Order Not Found"
        }
    }
}

export default async function GetSingleOrder(context: { params: Promise<{ uploadId: string }> }) {
    const { uploadId } = await context.params;
    const queryClient = new QueryClient();

    try {
        const data = await queryClient.fetchQuery({
            queryKey: ['singleOrder', uploadId],
            queryFn: () => fetchSinglePrintUpload({ uploadId: uploadId }),
        });
        if (!data || data.error) notFound();
    } catch (error) {
        notFound();
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <GetSingleOrderPage uploadId={uploadId} />
        </HydrationBoundary>
    );
}