
export default function Footer() {
    return (
        <footer className="flex items-center justify-center p-6 w-full bg-bg-secondary">
            <h1 className="text-xl text-text-secondary font-semibold">
                &copy; Printify {new Date().getFullYear()} | All rights reserved.
            </h1>
        </footer>
    );
}