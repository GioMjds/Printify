import { faCloud, faUpload } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface NavbarItem {
    name: string;
    href: string;
    icon?: IconDefinition;
}

export const navbar: NavbarItem[] = [
    { icon: faUpload, name: "Upload", href: "/upload" },
    { icon: faCloud, name: "My Orders", href: "/my-orders" },
];
