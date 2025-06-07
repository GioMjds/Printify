
export default function Footer() {
    return (
        <footer className="flex items-center justify-center p-6 w-full bg-[var(--color-accent)] shadow-inner">
            <h1 className="text-xl text-[var(--color-primary)] font-semibold drop-shadow-sm">
                &copy; Printify {new Date().getFullYear()} | All rights reserved.
            </h1>
        </footer>
    );
}