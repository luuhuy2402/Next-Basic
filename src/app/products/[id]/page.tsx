import productApiRequest from "@/apiRequests/product";
import React from "react";

export default async function ProductEdit({
    params,
}: {
    params: { id: string };
}) {
    let product = null;
    try {
        const { payload } = await productApiRequest.getDetail(
            Number(params.id)
        );
        product = payload.data;
    } catch (error) {}

    return (
        <div>
            {!product && <div>Không tìm thấy sản phảm!</div>}
            {product && <>{product.name}</>}
        </div>
    );
}
