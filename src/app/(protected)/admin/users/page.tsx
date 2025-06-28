import { 
    dehydrate,
    HydrationBoundary,
    QueryClient
} from "@tanstack/react-query";
import AdminUsers from "./users";
import { fetchUsers } from "@/services/Admin";

export const metadata = {
    title: "Users",
}

export default async function UsersPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['adminUsers'],
        queryFn: fetchUsers,
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AdminUsers />
        </HydrationBoundary>
    );
}