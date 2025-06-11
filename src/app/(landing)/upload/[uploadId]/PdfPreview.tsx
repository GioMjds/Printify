"use client";

import { useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

interface PdfPreviewProps {
    fileUrl: string;
}

export default function PdfPreview({ fileUrl }: PdfPreviewProps) {
    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc =
            `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    }, []);

    return (
        <div className="h-[400px] overflow-auto">
            <Document file={fileUrl} className="pdf-viewer">
                <Page
                    pageNumber={1}
                    width={600}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                />
            </Document>
        </div>
    );
}
