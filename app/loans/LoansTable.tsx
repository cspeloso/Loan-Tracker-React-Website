"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


type Loan = {
    id: number;
    name: string;
    principal: number;
    interestRate: number;
    termInMonths: number;
    monthlyPayment: number;
    startDate: string;
};

export default function LoansTable({ initialLoans }: { initialLoans: Loan[] }) {
    
    const router = useRouter();

    const [loans, setLoans] = useState(initialLoans);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    async function handleDelete(loan: Loan) {
        const ok = window.confirm(`Delete loan "${loan.name}"? This cannot be undone.`);

        if (!ok) return;

        try {
            setDeletingId(loan.id);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loans/${loan.id}`, { method: "DELETE" });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || `Delete failed (${res.status})`);
            }

            setLoans((prev) => prev.filter((l) => l.id !== loan.id));
        }
        catch (e: any) {
            alert(e?.message ?? "Failed to delete loan");
        }
        finally {
            setDeletingId(null);
        }
    }

    const totalPrincipal = loans.reduce((sum, l) => sum + (Number(l.principal) || 0), 0)
    const totalMonthlyPayment = loans.reduce((sum, l) => sum + (Number(l.monthlyPayment) || 0), 0)
    const interestRates = loans.map(l => l.interestRate).filter(r => r > 0);

    const minRate = interestRates.length ? Math.min(...interestRates) : null;
    const maxRate = interestRates.length ? Math.max(...interestRates) : null;


    const money = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    });

    return (
        <table className="loan-table" border={1} cellPadding={8} cellSpacing={0}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Principal</th>
                    <th>Interest Rate</th>
                    <th>Term (Months)</th>
                    <th>Monthly Payment</th>
                    <th>Start Date</th>
                    <th className='warning-text'>Update Loan Info</th>
                    <th className='important-text'>Delete Loan</th>
                </tr>
            </thead>
            <tbody>
                {loans.map((loan) => (
                    <tr key={loan.id}>
                        <td>{loan.name}</td>
                        <td>${loan.principal}</td>
                        <td>{loan.interestRate}%</td>
                        <td>{loan.termInMonths}</td>
                        <td>${loan.monthlyPayment}</td>
                        <td>{new Date(loan.startDate).toLocaleDateString()}</td>
                        <td>
                            <button type="button" onClick={() => router.push(`/loans/${loan.id}/edit`)}>
                                Edit
                            </button>
                        </td>
                        <td className='delete-loan-button'>
                            <button
                            type="button"
                            onClick={() => handleDelete(loan)}
                            disabled={deletingId == loan.id}>
                                {deletingId === loan.id ? "..." : "X"}
                            </button>
                        </td>
                    </tr>
                ))}
                {loans.length > 1 && (
                    <tr>
                        <td><strong>Total</strong></td>
                        <td><strong>{money.format(totalPrincipal)}</strong></td>
                        <td><strong>{minRate}% — {maxRate}%</strong></td>
                        <td>—</td>
                        <td><strong>{money.format(totalMonthlyPayment)}</strong></td>
                        <td>—</td>
                        <td>—</td>
                        <td>—</td>
                    </tr>
                )}
                {loans.length === 0 && (
                    <tr>
                        <td colSpan={8} style={{textAlign: "center"}}>
                            <p>No loans to display.</p>
                            <a href='/loans/new'>Click here to add some!</a>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}