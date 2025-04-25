import accountApiRequest from "@/apiRequests/account";
import ProfileForm from "@/app/me/profile-form";
import { cookies } from "next/headers";
import React from "react";

export default async function MeProfile() {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get("sessionToken");
    // console.log("page me",sessionToken);
    const result = await accountApiRequest.me(sessionToken?.value || "");
    // console.log(result);
    return (
        <div>
            <h1>Profile</h1>
            <ProfileForm profile={result.payload.data} />
        </div>
    );
}
