"use client";

import { useState } from "react";

export default function NewLoanForm() {
    const [form, setForm] = useState({
        name: "",
        principal: "",
        interestRate: "",
        termInMonths: "",
        monthlyPayment: "",
        startDate: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/loans`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: form.name,
                    principal: Number(form.principal),
                    interestRate: Number(form.interestRate),
                    termInMonths: Number(form.termInMonths),
                    monthlyPayment: Number(form.monthlyPayment),
                    startDate: form.startDate
                }),
            }
        );

        if (!res.ok) {
            setError("Failed to create loan");
        }
        else {
            setSuccess(true);
            setForm({
                name: "",
                principal: "",
                interestRate: "",
                termInMonths: "",
                monthlyPayment: "",
                startDate: ""
            });
        }

        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="card p-4" style={{ maxWidth: 500 }}>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">Loan created</div>}

            <div className="mb-3">
                <label className="form-label">Loan Name</label>
                <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="mb-3">
                <label className="form-label">Principal</label>
                <input className="form-control" name="principal" type="number" value={form.principal} onChange={handleChange} required />
            </div>

            <div className="mb-3">
                <label className="form-label">Interest Rate (%)</label>
                <input className="form-control" name="interestRate" type="number" step="0.01" value={form.interestRate} onChange={handleChange} required />
            </div>

            <div className="mb-3">
                <label className="form-label">Term (Months)</label>
                <input className="form-control" name="termInMonths" type="number" value={form.termInMonths} onChange={handleChange} required />
            </div>

            <div className="mb-3">
                <label className="form-label">Monthly Payment</label>
                <input className="form-control" name="monthlyPayment" type="number" step="0.01" value={form.monthlyPayment} onChange={handleChange} required />
            </div>

            <div className="mb-3">
                <label className="form-label">Start Date</label>
                <input className="form-control" name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
            </div>

            <button className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Create Loan"}
            </button>
        </form>
    );
}
