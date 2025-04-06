import { z } from "zod";

const configSchema = z.object({
    NEXT_PUBLIC_API_ENDPOINT: z.string(),
});
//safeParse() là hàm dùng để kiểm tra dữ liệu xem có đúng với schema đã định nghĩa không.
/**
 * nếu dữ liệu đúng thì trả về một object 
 * {
    success: true,
    data: ...       
    }
 */
const configProject = configSchema.safeParse({
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
});
// console.log(configProject);
if (!configProject.success) {
    console.error(configProject.error.issues);
    throw new Error("Các giá trị khai báo trong file .env không hợp lệ");
}

const envConfig = configProject.data;
export default envConfig;
