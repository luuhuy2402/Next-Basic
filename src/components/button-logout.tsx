"use client";

import authApiRequest from "@/apiRequests/auth";
import { useAppContext } from "@/app/app-provider";
import { Button } from "@/components/ui/button";
import { handleErrorApi } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

export default function ButtonLogout() {
    // const { user } = useAppContext();
    // console.log(user);
    const router = useRouter();
    const pathname = usePathname();
    const handleLogout = async () => {
        try {
            await authApiRequest.logoutFromNextClientToNextServer();
            router.push("/login");
        } catch (error) {
            handleErrorApi({
                error,
            });
            authApiRequest
                .logoutFromNextClientToNextServer(true)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .then((res) => {
                    router.push(`/login?redirectFrom=${pathname}`);
                });
        } finally {
            router.refresh();
        }
    };
    return (
        <Button size={"sm"} onClick={handleLogout}>
            Đăng xuất
        </Button>
    );
}
