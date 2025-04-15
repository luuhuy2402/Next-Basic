import accountApiRequest from "@/apiRequests/account";
import Profile from "@/app/me/profile";
import { cookies } from "next/headers";
import React from "react";

export default async function page() {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get("sessionToken");
    // console.log(sessionToken);
    const result = await accountApiRequest.me(sessionToken?.value || "");
    // console.log(result);
    return (
        <div>
            <h1>Profile</h1>
            <div>Xin chào {result.payload.data?.name}</div>
            <Profile />
        </div>
    );
}
