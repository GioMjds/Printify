import { 
    dehydrate, 
    HydrationBoundary, 
    QueryClient 
} from '@tanstack/react-query';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UploadPage from './upload-file';

export const metadata = {
    title: "Upload Your Files",
}

export const dynamic = "force-dynamic";

export default async function Upload() {
    const session = await getSession();
    const queryClient = new QueryClient();

    if (!session) redirect('/login');

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <UploadPage />
        </HydrationBoundary>
    )
}
