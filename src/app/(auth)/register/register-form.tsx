"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RegisterBody, RegisterBodyType } from "@/schemaValidation/auth.schema";
import { Input } from "@/components/ui/input";
import authApiRequest from "@/apiRequests/auth";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";
import { useState } from "react";

const RegisterForm = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<RegisterBodyType>({
        resolver: zodResolver(RegisterBody),
        defaultValues: {
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
        },
    });
    // 2. Define a submit handler.
    async function onSubmit(values: RegisterBodyType) {
        if (loading) return;
        setLoading(true);
        try {
            const result = await authApiRequest.register(values);

            //sau khi đăng nhập thành công thì từ next client fetch bất kì 1 api lên next server gửi lên đó cái token để next server set cái token đó vào cookie
            await authApiRequest.auth({
                sessionToken: result.payload.data.token,
                expiresAt: result.payload.data.expiresAt,
            });
            toast("Thành công", {
                description: result.payload.message,
                className:
                    "bg-green-100 text-green-800 border border-green-300",
                icon: <CheckCircle className="text-green-500" />,
            });
            //khi đăng nhập thành công và đã set token thì chuyển sang trang me
            router.push("/me");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            handleErrorApi({ error, setError: form.setError });
        } finally {
            setLoading(false);
        }
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
                noValidate
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="shadcn"
                                    type="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="shadcn"
                                    type="password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nhập lại mật khẩu</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="shadcn"
                                    type="password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="!mt-8 w-full">
                    Đăng ký
                </Button>
            </form>
        </Form>
    );
};

export default RegisterForm;
