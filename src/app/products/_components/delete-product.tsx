"use client";

import { Button } from "@/components/ui/button";
import { ProductResType } from "@/schemaValidation/product.schema";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import productApiRequest from "@/apiRequests/product";
import { handleErrorApi } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteProduct({
    product,
}: {
    product: ProductResType["data"];
}) {
    const router = useRouter();
    const deleteProduct = async () => {
        try {
            const result = await productApiRequest.delete(product.id);
            toast("Xóa sản phẩm thành công!", {
                description: result.payload.message,
            });
            router.refresh();
        } catch (error) {
            handleErrorApi({ error });
        }
    };
    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant={"destructive"}>Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Bạn có muốn xóa sản phẩm không?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Sản phẩm {product.name} sẽ bị xóa vĩnh viễn!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteProduct}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
