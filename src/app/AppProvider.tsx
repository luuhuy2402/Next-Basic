"use client";
import { clientSessionToken } from "@/lib/http";
import { useState } from "react";

export default function AppProvider({
    children,
    inititalSessionToken = "",
}: {
    children: React.ReactNode;
    inititalSessionToken?: string;
}) {
    // khi render lần đầu thì nó sẽ chạy useState trước xong ms đến return bên dưới
    useState(() => {
        if (typeof window !== "undefined") {
            clientSessionToken.value = inititalSessionToken;
        }
    });

    return <>{children}</>;
}
