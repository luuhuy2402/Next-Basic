"use client";
import { clientSessionToken } from "@/lib/http";
import { AccountResType } from "@/schemaValidation/account.schema";
import { createContext, useContext, useState } from "react";
type User = AccountResType["data"];
const AppContext = createContext<{
    user: User | null;
    setUser: (user: User | null) => void;
}>({
    user: null,
    setUser: () => {},
});
export const useAppContext = () => {
    const context = useContext(AppContext);
    return context;
};
export default function AppProvider({
    children,
    inititalSessionToken = "",
    user: userProp,
}: {
    children: React.ReactNode;
    inititalSessionToken?: string;
    user: User | null;
}) {
    const [user, setUser] = useState<User | null>(userProp);
    // khi render lần đầu thì nó sẽ chạy useState trước xong ms đến return bên dưới
    useState(() => {
        if (typeof window !== "undefined") {
            clientSessionToken.value = inititalSessionToken;
        }
        // console.log("inititalSessionToken", inititalSessionToken);
    });
    return (
        <AppContext.Provider value={{ user, setUser }}>
            {children}
        </AppContext.Provider>
    );
}
