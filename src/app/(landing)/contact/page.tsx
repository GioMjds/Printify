import { Metadata } from "next";
import ContactForm from "./contact-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with us for any inquiries or support."
};

export default function Contact() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-r from-bg-primary to-bg-secondary px-4 sm:px-6 pt-20 pb-8 flex items-center justify-center">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-200 mb-4">Contact Us</h1>
                    <p className="text-xl text-accent max-w-2xl mx-auto">
                        Have questions or need support? Reach out to our team and we&apos;ll get back to you as soon as possible.
                    </p>
                </div>
                <div className="flex justify-center items-center">
                    <div className="glass-card p-8 rounded-3xl w-full max-w-lg">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    )
}