import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Printify",
        description: "Your go-to platform for seamless print order management.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0E2148",
        icons: [
            {
                src: '/favicon.ico',
                sizes: '64x64 32x32 24x24 16x16',
                type: 'image/x-icon',
            }
        ]
    }
}