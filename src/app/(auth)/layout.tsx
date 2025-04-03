import Link from "next/link";
import React from "react";

export default function AuthLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div>
            <h1>Auth Layout</h1>
            <div>
                <Link href="/">Home</Link>
            </div>
            {children}
        </div>
    );
}
