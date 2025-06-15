import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
            >
                <h2 className="text-3xl font-bold text-yellow-600 mb-2">Order Not Found</h2>
                <p className="text-yellow-500 mb-4">The requested print order could not be found. It may have been deleted or does not exist.</p>
                <Link
                    href="/admin/orders"
                    className="mt-4 inline-block px-6 py-2 bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-700 transition"
                >
                    Back to Orders
                </Link>
            </motion.div>
        </div>
    );
}