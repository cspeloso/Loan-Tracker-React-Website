"use client";

import { useRouter } from "next/navigation"
import LoanForm from "@/components/LoanForm"
import { Loan } from "@/types/loan"

export default function CreateLoanClient() {

    const router = useRouter();

    return (
        <LoanForm
            submitLabel="Add a New Loan"
            initialValues={{
                name: "",
                principal: 0,
                interestRate: 0,
                termInMonths: 0,
                monthlyPayment: 0,
                startDate: new Date().toISOString().slice(0,10)
            }}
            onSubmit={async (newLoan) => {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loans/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify(newLoan)
                });

                if(!res.ok)
                {
                    const text = await res.text().catch(() => "");
                    throw new Error(text || `Adding new loan failed (${res.status})`);
                }

                router.push("/loans");
                router.refresh();
            }}
        />
    );
}