'use client';

export default function ConfirmBtns() {
    return (
        <>
            <button
                onClick={() => window.history.back()}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium shadow hover:bg-gray-300 transition-colors duration-200"
            >
                Go Back
            </button>
            <button
                onClick={() => alert('Print order confirmed!')}
                className="bg-accent text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-highlight transition-colors duration-200"
            >
                Confirm Print Order
            </button>
        </>
    )
}