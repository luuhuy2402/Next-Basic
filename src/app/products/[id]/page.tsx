import productApiRequest from "@/apiRequests/product";
import ProductAddForm from "@/app/products/_components/product-add-form";
import React from "react";

export default async function ProductEdit({
    params,
}: {
    params: { id: string };
}) {
    const id = Number(params.id);

    let product = undefined;
    try {
        const { payload } = await productApiRequest.getDetail(id);
        product = payload.data;
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    }
    return (
        <div>
            {!product && <div>Không tìm thấy sản phảm!</div>}
            <ProductAddForm product={product} />
        </div>
    );
}
