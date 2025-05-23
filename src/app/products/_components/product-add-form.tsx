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
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";
import { useRef, useState } from "react";
import {
    CreateProductBody,
    CreateProductBodyType,
    ProductResType,
    UpdateProductBodyType,
} from "@/schemaValidation/product.schema";
import productApiRequest from "@/apiRequests/product";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

type Product = ProductResType["data"];

const ProductAddForm = ({ product }: { product?: Product }) => {
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<CreateProductBodyType>({
        resolver: zodResolver(CreateProductBody),
        defaultValues: {
            name: product?.name ?? "",
            description: product?.description ?? "",
            image: product?.image ?? "",
            price: product?.price ?? 0,
        },
    });
    const image = form.watch("image");
    // 2. Define a submit handler.
    const createProduct = async (values: CreateProductBodyType) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file as Blob);
            const uploadImageResult = await productApiRequest.uploadImage(
                formData
            );
            const imageUrl = uploadImageResult.payload.data;
            const result = await productApiRequest.create({
                ...values,
                image: imageUrl,
            });
            toast("Thành công", {
                description: result.payload.message,
                className:
                    "bg-green-100 text-green-800 border border-green-300",
                icon: <CheckCircle className="text-green-500" />,
            });

            router.push("/products");
            router.refresh();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            handleErrorApi({ error, setError: form.setError });
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (_values: UpdateProductBodyType) => {
        if (!product) return;
        setLoading(true);
        let values = _values;
        try {
            if (file) {
                const formData = new FormData();
                formData.append("file", file as Blob);
                const uploadImageResult = await productApiRequest.uploadImage(
                    formData
                );
                const imageUrl = uploadImageResult.payload.data;
                values = {
                    ...values,
                    image: imageUrl,
                };
            }

            const result = await productApiRequest.update(product.id, values);
            toast("Thành công", {
                description: result.payload.message,
                className:
                    "bg-green-100 text-green-800 border border-green-300",
                icon: <CheckCircle className="text-green-500" />,
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            handleErrorApi({ error, setError: form.setError });
        } finally {
            setLoading(false);
        }
    };

    async function onSubmit(values: CreateProductBodyType) {
        if (loading) return;
        if (product) {
            await updateProduct(values);
        } else {
            await createProduct(values);
        }
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, (error) => {
                    console.log(error);
                    console.log(form.getValues("image"));
                })}
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
                                <Input
                                    placeholder="Tên"
                                    type="text"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gía</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="giá"
                                    type="number"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                                <Textarea placeholder="mô tả" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hinh ảnh</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    ref={inputRef}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setFile(file);
                                            field.onChange(
                                                "http://localhost:3000/" +
                                                    file.name
                                            );
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {(file || image) && (
                    <div>
                        <Image
                            src={file ? URL.createObjectURL(file) : image}
                            width={128}
                            height={128}
                            alt="preview"
                            className="w-32 h-32 object-cover"
                            priority
                        />
                        <Button
                            type="button"
                            variant={"destructive"}
                            size={"sm"}
                            onClick={() => {
                                setFile(null);
                                form.setValue("image", "");
                                if (inputRef.current) {
                                    inputRef.current.value = "";
                                }
                            }}
                        >
                            Xoá hình ảnh
                        </Button>
                    </div>
                )}
                <Button type="submit" className="!mt-8 w-full">
                    {product ? "Cập nhật sản phẩm" : " Thêm sản phẩm"}
                </Button>
            </form>
        </Form>
    );
};

export default ProductAddForm;
