import { FileIcon } from "lucide-react";

interface DownloadButtonProps {
    url: string;
    filename: string;
}

export function DownloadButton({ url, filename }: DownloadButtonProps) {
    return (
        <a
            href={url}
            download={filename}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-highlight transition-colors"
        >
            <FileIcon size={16} />
            <span>Download File</span>
        </a>
    );
}