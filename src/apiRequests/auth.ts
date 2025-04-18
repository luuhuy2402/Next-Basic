import http from "@/lib/http";
import {
    LoginBodyType,
    LoginResType,
    RegisterBodyType,
    RegisterResType,
} from "@/schemaValidation/auth.schema";

const authApiRequest = {
    login: (body: LoginBodyType) =>
        http.post<LoginResType>("/auth/login", body),
    register: (body: RegisterBodyType) =>
        http.post<RegisterResType>("/auth/register", body),
    //api gọi lên next server. khi đăng nhập thành công 
    auth: (body: { sessionToken: string }) =>
        http.post("/api/auth", body, {
            baseUrl: "",
        }),
};

export default authApiRequest;
