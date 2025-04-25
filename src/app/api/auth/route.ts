//này là api của next

export async function POST(request: Request) {
    const body = await request.json();

    //Lấy token mà khi nextClient request lên gửi lên
    const sessionToken = body.sessionToken as string;

    const expiresAt = body.expiresAt as string;
    if (!sessionToken) {
        return Response.json(
            { message: "Không nhận được session token" },
            {
                status: 400,
            }
        );
    }

    const expiresDate = new Date(expiresAt).toUTCString();
    return Response.json(body, {
        status: 200,
        headers: {
            "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${expiresDate};SameSite=Lax;Secure`, //set-cookie cho next client
        },
    });
}
