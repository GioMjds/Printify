import { fetchSinglePrintUpload } from "@/services/Customer";
import { 
    dehydrate, 
    HydrationBoundary, 
    QueryClient 
} from "@tanstack/react-query";
import GetSingleOrderPage from "./get-single-order";

export default async function GetSingleOrder(context: { params: Promise<{ uploadId: string }> }) {
    const { uploadId } = await context.params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['singleOrder', uploadId],
        queryFn: () => fetchSinglePrintUpload({ uploadId: uploadId }),
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <GetSingleOrderPage uploadId={uploadId} />
        </HydrationBoundary>
    );
}