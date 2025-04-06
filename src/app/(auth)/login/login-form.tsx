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
import { Input } from "@/components/ui/input";
import envConfig from "@/config";
import { LoginBody, LoginBodyType } from "@/schemaValidation/auth.schema";
import { toast } from "sonner";

const LoginForm = () => {
    // const { toast } = useToast();

    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: LoginBodyType) {
        try {
            const result = await fetch(
                `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
                {
                    body: JSON.stringify(values),
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                }
            ).then(async (res) => {
                const payload = await res.json();
                // console.log(payload);
                const data = {
                    status: res.status,
                    payload,
                };
                if (!res.ok) {
                    throw data;
                }
                return data;
            });
            toast("Thành công", {
                description: result.payload.message,
              
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errors = error.payload.errors as {
                field: string;
                message: string;
            }[];
            const status = error.status as number;
            if (status === 422) {
                errors.forEach((error) => {
                    form.setError(error.field as "email" | "password", {
                        type: "server",
                        message: error.message,
                    });
                });
            } else {
                toast("Lỗi", {
                    description: error.payload.message,
                });
            }
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

                <Button type="submit" className="!mt-8 w-full">
                    Đăng nhập
                </Button>
            </form>
        </Form>
    );
};

export default LoginForm;
