/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const handleErrorApi = ({
    error,
    setError,
    duration,
}: {
    error: any;
    setError?: UseFormSetError<any>;
    duration?: number;
}) => {
    if (error instanceof EntityError && setError) {
        error.payload.errors.forEach((item) => {
            setError(item.field, {
                type: "server",
                message: item.message,
            });
        });
    } else {
        toast("Lỗi", {
            description: error?.payload?.message ?? "Lỗi không xác định",
            duration: duration ?? 5000,
        });
    }
};
