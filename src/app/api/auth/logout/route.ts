import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

//này là api của next
export async function POST(request: Request) {
    //nếu client gửi lên force thì buộc phải logout thì sẽ ko chạy đoạn mã dưới logout từ nextserver nữa
    const res = await request.json();
    const force = res.force as boolean | undefined;
    if (force) {
        return Response.json(
            {
                message: "Buộc đăng xuất thành công",
            },
            {
                status: 200,
                headers: {
                    // Xóa cookie sessionToken
                    "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
                },
            }
        );
    }

    const cookieStore = cookies();
    //lấy token để gửi lên nextserver
    const sessionToken = (await cookieStore).get("sessionToken");

    if (!sessionToken) {
        return Response.json(
            { message: "Không nhận được session token" },
            {
                status: 401,
            }
        );
    }
    try {
        const result = await authApiRequest.logoutFromNextServerToServer(
            sessionToken.value
        );
        return Response.json(result.payload, {
            status: 200,
            headers: {
                //Xóa cookie sessionToken
                "Set-Cookie": `sessionToken=;Path=/;HttpOnly;Max-Age=0`,
            },
        });
    } catch (error) {
        if (error instanceof HttpError) {
            return Response.json(error.payload, { status: error.status });
        } else {
            return Response.json(
                { message: "Lỗi không xác định!" },
                { status: 500 }
            );
        }
    }
}
