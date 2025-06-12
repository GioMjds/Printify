import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UploadFilePage from "./upload-file";

export const metadata = {
    title: "Upload Your Files",
}

export default async function Upload() {
    const session = await getSession();
    if (!session) redirect('/login');

    return (
        <UploadFilePage customerId={session.userId} />
    )
}
