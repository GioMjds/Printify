import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { FileIcon } from './file-icon';
import { DownloadButton } from './download-btn';
import ConfirmBtns from './confirm-btns';

interface UploadPageProps {
    params: { uploadId: string };
}

export default async function UploadIDPage({ params }: UploadPageProps) {
    const session = await getSession();
    if (!session) redirect('/login');
    
    const upload = await prisma.upload.findUnique({
        where: { id: params.uploadId },
        include: { customer: true },
    });
    
    if (!upload || upload.customerId !== session.userId) return notFound();
    
    const fileExtension = upload.filename.split('.').pop()?.toLowerCase();
    const isPDF = fileExtension === 'pdf';
    const isWord = fileExtension === 'doc' || fileExtension === 'docx';

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-bg-primary to-bg-accent relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-bg-accent opacity-20 rounded-full blur-3xl z-0" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-bg-highlight opacity-15 rounded-full blur-3xl z-0" />
            
            <div className="relative z-10 bg-white/90 rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col items-center max-w-3xl w-full">
                <h1 className="text-3xl font-bold text-primary mb-6">Confirm Your Print Order</h1>
                
                <div className="w-full mb-8 p-4 bg-bg-soft rounded-xl">
                    <div className="flex items-center mb-4">
                        <div className="mr-3">
                            <FileIcon extension={fileExtension} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-text-dark truncate max-w-xs">
                                {upload.filename}
                            </h2>
                            <p className="text-sm text-text-light">
                                {new Date(upload.createdAt).toLocaleDateString()} • {fileExtension?.toUpperCase()} file
                            </p>
                        </div>
                    </div>
                    
                    <div className="border-t border-border-light pt-4">
                        <h3 className="text-lg font-semibold text-accent mb-3">File Preview</h3>
                        
                        <div className="bg-white rounded-lg border border-border-light p-2">
                            {isPDF ? (
                                <div className="h-[400px]">
                                    <iframe 
                                        src={upload.url} 
                                        className="w-full h-full"
                                        title="PDF Preview"
                                    />
                                </div>
                            ) : isWord ? (
                                <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-lg">
                                    <div className="text-6xl mb-4 text-accent">
                                        <FileIcon extension={fileExtension} size={48} />
                                    </div>
                                    <p className="text-lg text-text-light mb-6 text-center">
                                        Word document preview not available
                                    </p>
                                    <p className="text-sm text-text-light mb-4 text-center max-w-md">
                                        For printing accuracy, please review your document in Microsoft Word before confirming.
                                    </p>
                                    <DownloadButton url={upload.url} filename={upload.filename} />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-lg">
                                    <div className="text-6xl mb-4 text-accent">
                                        <FileIcon extension={fileExtension} size={48} />
                                    </div>
                                    <p className="text-lg text-text-light">
                                        File preview not available
                                    </p>
                                    <DownloadButton url={upload.url} filename={upload.filename} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="flex space-x-4">
                    <ConfirmBtns />
                </div>
            </div>
        </main>
    );
}