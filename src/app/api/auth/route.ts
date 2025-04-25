import { decodeJWT } from "@/lib/utils";

type PayloadJWT = {
    iat: number;
    exp: number;
    useId: number;
    tokenType: string;
};

//này là api của next

export async function POST(request: Request) {
    const res = await request.json();

    //Lấy token mà khi nextClient request lên gửi lên
    const sessionToken = res.sessionToken as string;

    if (!sessionToken) {
        return Response.json(
            { message: "Không nhận được session token" },
            {
                status: 400,
            }
        );
    }
    const payload = decodeJWT<PayloadJWT>(sessionToken);
    const expiresDate = new Date(payload.exp * 1000).toUTCString();
    return Response.json(res, {
        status: 200,
        headers: {
            "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${expiresDate};SameSite=Lax;Secure`, //set-cookie cho next client
        },
    });
}
