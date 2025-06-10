import { RegisterPhaseRequired } from "@/components/RegisterPhaseRequired";
import VerifyOTP from "./verify-otp";

export const metadata = {
    title: "Verify your account",
}

export default function VerifyPage() {
    return (
        <RegisterPhaseRequired>
            <VerifyOTP />
        </RegisterPhaseRequired>
    )
}