
export default function Footer() {
    return (
        <footer className="flex items-center justify-center p-4 sm:p-5 md:p-6 w-full bg-secondary shadow-inner">
            <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl text-highlight font-semibold drop-shadow-sm text-center">
                &copy; Printify {new Date().getFullYear()} | All rights reserved.
            </h1>
        </footer>
    );
}