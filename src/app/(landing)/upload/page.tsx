import { 
    dehydrate, 
    HydrationBoundary, 
    QueryClient 
} from '@tanstack/react-query';
import { getSession } from '@/lib/auth';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

const UploadFilePage = dynamic(() => import("./upload-file"));

export const metadata = {
    title: "Upload Your Files",
}

export default async function Upload() {
    const session = await getSession();
    const queryClient = new QueryClient();

    if (!session) redirect('/login');

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <UploadFilePage />
        </HydrationBoundary>
    )
}
