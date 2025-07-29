import { RegisterPhaseRequired } from "@/components/RegisterPhaseRequired";
import VerifyOTP from "./verify-otp";

export const metadata = {
    title: "Verify your account",
}

export const dynamic = "force-dynamic";

export default function VerifyPage() {
    return (
        <RegisterPhaseRequired>
            <VerifyOTP />
        </RegisterPhaseRequired>
    )
}