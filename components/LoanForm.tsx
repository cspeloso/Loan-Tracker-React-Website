"use client";

import { useState } from "react";
import type { Loan } from "@/types/loan";

export default function LoanForm({ initialValues, onSubmit, submitLabel }: { initialValues: Loan; onSubmit: (loan: Loan) => Promise<void>; submitLabel: string }) {

    const [loan, setLoan] = useState(initialValues);
    const [saving, setSaving] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        await onSubmit(loan);
        setSaving(false);
    }

    return (

        <form onSubmit={handleSubmit} className="loan-form">
            <div>
                <label htmlFor="loan_name_field">Loan Name</label>
                <input id="loan_name_field" value={loan.name} onChange={(e) => setLoan({ ...loan, name: e.target.value })} placeholder="Name" />
            </div>

            <div>
                <label htmlFor="loan_principal_field">Principal</label>
                <input id="loan_principal_field" type="number" value={loan.principal} onChange={(e) => setLoan({ ...loan, principal: Number(e.target.value) })} />
            </div>

            <div>
                <label htmlFor="loan_interest_rate_field">Interest Rate</label>
                <input id="loan_interest_rate_field" type="number" value={loan.interestRate} onChange={(e) => setLoan({ ...loan, interestRate: Number(e.target.value) })} />
            </div>

            <div>
                <label htmlFor="loan_term_field">Loan Term (In Months)</label>
                <input id="loan_term_field" type="number" value={loan.termInMonths} onChange={(e) => setLoan({ ...loan, termInMonths: Number(e.target.value) })} />
            </div>

            <div>
                <label htmlFor="loan_monthly_payment_field">Monthly Payment</label>
                <input id="loan_monthly_payment_field" type="number" value={loan.monthlyPayment} onChange={(e) => setLoan({ ...loan, monthlyPayment: Number(e.target.value) })} />
            </div>

            <div>
                <label htmlFor="loan_start_date_field">Start Date</label>
                <input id="loan_start_date_field" type="date" value={loan.startDate} onChange={(e) => setLoan({ ...loan, startDate: e.target.value })} />
            </div>

            <button type="submit" disabled={saving}>
                {saving ? "Saving..." : submitLabel}
            </button>
        </form>
    );
}
