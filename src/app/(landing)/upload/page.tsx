import { getSession } from '@/lib/auth';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

const UploadFilePage = dynamic(() => import("./upload-file"));

export const metadata = {
    title: "Upload Your Files",
}

export default async function Upload() {
    const session = await getSession();
    if (!session) redirect('/login');

    return (
        <UploadFilePage />
    )
}
