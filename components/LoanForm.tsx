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

//         <form onSubmit={handleSubmit} className="card p-4" style={{ maxWidth: 500 }}>
//             {error && <div className="alert alert-danger">{error}</div>}
//             {success && <div className="alert alert-success">Loan created</div>}

//             <div className="mb-3">
//                 <label className="form-label">Loan Name</label>
//                 <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
//             </div>

//             <div className="mb-3">
//                 <label className="form-label">Principal</label>
//                 <input className="form-control" name="principal" type="number" value={form.principal} onChange={handleChange} required />
//             </div>

//             <div className="mb-3">
//                 <label className="form-label">Interest Rate (%)</label>
//                 <input className="form-control" name="interestRate" type="number" step="0.01" value={form.interestRate} onChange={handleChange} required />
//             </div>

//             <div className="mb-3">
//                 <label className="form-label">Term (Months)</label>
//                 <input className="form-control" name="termInMonths" type="number" value={form.termInMonths} onChange={handleChange} required />
//             </div>

//             <div className="mb-3">
//                 <label className="form-label">Monthly Payment</label>
//                 <input className="form-control" name="monthlyPayment" type="number" step="0.01" value={form.monthlyPayment} onChange={handleChange} required />
//             </div>

//             <div className="mb-3">
//                 <label className="form-label">Start Date</label>
//                 <input className="form-control" name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
//             </div>

//             <button className="btn btn-primary" disabled={loading}>
//                 {loading ? "Saving..." : "Create Loan"}
//             </button>
//         </form>
//     );
// }
