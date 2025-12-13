"use client";

import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    TimeScale
} from "chart.js";
import type { ChartOptions } from "chart.js"
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { Loan } from "@/types/loan"

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    TimeScale,
    Tooltip,
    Legend
);

type LoanChartProps = {
    data: Loan[];
}

function generateAmortizationSchedule(principal: number, annualRate: number, termMonths: number, monthlyPayment: number, startDate: Date) {

    const monthlyRate = annualRate / 100 / 12;

    let balance = principal;

    const schedule: { date: Date; balance: number }[] = [];

    let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

    for (let month = 0; month < termMonths; month++) {
        const interest = balance * monthlyRate;
        const principalPaid = monthlyPayment - interest;
        balance -= principalPaid;

        //  guard against tiny negative numbers at the end
        if (balance < 0)
            balance = 0;

        schedule.push({
            date: new Date(currentDate),
            balance
        });

        currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            currentDate.getDate()
        );
    }

    return schedule;
}

function colorForIndex(i: number) {
    const hue = (i * 67) % 360;
    return `hsl(${hue} 70% 45%)`;
}

function parseDateOnlyLocal(dateStr: string) {
    const d10 = dateStr.slice(0,10);
    const [y,m,d] = d10.split("-").map(Number);
    return new Date(y, m-1, d);
}

export default function LoanChart({ data }: LoanChartProps) {

    if (data.length === 0)
        return <p>No loans to chart.</p>;

    const money = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    });


    const datasets = data.map((loan, i) => {
        const schedule = generateAmortizationSchedule(
            loan.principal,
            loan.interestRate,
            loan.termInMonths,
            loan.monthlyPayment,
            parseDateOnlyLocal(loan.startDate)
        );

        const c = colorForIndex(i);

        return {
            label: loan.name,
            data: schedule.map(p => ({
                x: p.date,
                y: p.balance
            })),
            borderColor: c,
            backgroundColor: c,
            borderWidth: 2,
            tension: 0.25,
            pointRadius: 0,
            pointHoverRadius: 4,
            originalPrincipal: loan.principal
        };
    });

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "nearest", intersect: false },
        plugins: {
            legend: {
                position: "top",
                labels: { usePointStyle: true, boxWidth: 10 }
            },
            tooltip: {
                callbacks: {
                    title: (items) => {
                        const d = items[0]?.parsed?.x;
                        if (d == null) return "";
                        return new Date(d).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric"
                        });
                    },
                    label: (ctx) => {
                        const principal = (ctx.dataset as any).originalPrincipal;
                        const balance = Number(ctx.parsed.y);
                        const percentage = ((1 - balance / principal) * 100).toFixed(1);
                        const monthsRemaining = ctx.dataset.data.length - ctx.dataIndex - 1;
                        return [
                            `${ctx.dataset.label}: ${money.format(balance)} (${percentage}% paid)`,
                            `Months Remaining: ${monthsRemaining}`
                        ]
                    }
                }
            }
        },
        scales: {
            x: {
                type: "time" as const,
                time: { unit: "year" },
                ticks: { autoSkip: true, maxRotation: 0 },
            },
            y: {
                beginAtZero: true,
                ticks: { callback: (v) => money.format(Number(v)) }
            }
        }
    }

    return (
        <div className="LoanChart" style={{ maxWidth: 900, height: 260, background: "white", padding: 16 }}>
            <Line data={{ datasets }} options={options} />
        </div>
    );
}