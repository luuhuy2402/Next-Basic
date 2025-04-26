import productApiRequest from "@/apiRequests/product";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function ProductDetail({
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
            {product && (
                <div>
                    <Link href={`/products/${product.id}`}>
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={180}
                            height={180}
                            className="w-32 h-32 object-cover"
                        />
                    </Link>

                    <h3>{product.name}</h3>
                    <div>{product.price}</div>
                </div>
            )}
        </div>
    );
}
