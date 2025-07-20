/**
 * Props for the error page component.
 */
export interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}