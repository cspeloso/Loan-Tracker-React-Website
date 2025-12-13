"use client";

import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
} from "chart.js";
import { join } from "path";
import { Line } from "react-chartjs-2";

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend
);

type Loan = {
    id: number;
    name: string;
    principal: number;
    interestRate: number;
    termInMonths: number;
    monthlyPayment: number;
    startDate: string;
};

type LoanChartProps = {
    data: Loan[];
}

function generateAmortizationSchedule(principal: number, annualRate: number, termMonths: number, monthlyPayment: number) {
    const monthlyRate = annualRate / 100 / 12;

    let balance = principal;

    const schedule: { month: number; balance: number }[] = [];

    for (let month = 1; month <= termMonths; month++) {
        const interest = balance * monthlyRate;
        const principalPaid = monthlyPayment - interest;

        balance = balance - principalPaid;

        //  guard against tiny negative numbers at the end
        if (balance < 0)
            balance = 0;

        schedule.push({ month, balance });
    }

    return schedule;
}

export default function LoanChart({ data }: LoanChartProps) {

    if (data.length === 0)
        return <p>No loans to chart.</p>;

    const schedules = data.map((loan) => ({
        loan,
        schedule: generateAmortizationSchedule(loan.principal, loan.interestRate, loan.termInMonths, loan.monthlyPayment)
    }));

    const maxMonths = Math.max(...schedules.map((s) => s.schedule.length));

    const labels = Array.from({ length: maxMonths }, (_, i) => `Month ${i + 1}`);

    const datasets = schedules.map(({ loan, schedule }) => ({
        label: `Remaining Balance - ${loan.name}`,
        data: schedule.map(s => ({ x: s.month, y: s.balance })),
        borderWidth: 2,
        tension: 0.3
    }));

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: "linear" as const,
                title: { display: true, text: "Month" },
                ticks: { precision: 0 }
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: "Remaining Balance" }
            }
        }
    }

    const chartData = {
        labels,
        datasets: schedules.map(({ loan, schedule }, index) => ({
            label: `Remaining Balance - ${loan.name}`,
            data: schedule.map((s) => s.balance),
            borderWidth: 2,
            tension: 0.3
        }))
    };

    return (
        <div className="LoanChart" style={{ maxWidth: 600, background: "white", padding: 16 }}>
            <Line data={{datasets}} options={options} />
        </div>
    );
}