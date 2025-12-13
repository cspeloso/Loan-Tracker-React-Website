"use client";

import {useRouter} from "next/navigation"
import LoanForm from "@/components/LoanForm"
import type { Loan } from "@/types/loan"

export default function EditLoanClient({id, initialLoan}: {id: string; initialLoan: Loan}){
    const router = useRouter();

    return (
        <LoanForm
            submitLabel="Update Loan"
            initialValues={initialLoan}
            onSubmit={async (updatedLoan) => {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loans/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify(updatedLoan)
                });

                if(!res.ok){
                    const text = await res.text().catch(() => "");
                    throw new Error(text || `Update failed (${res.status})`);
                }

                router.push("/loans");
                router.refresh();
            }}
        />
    );
}
