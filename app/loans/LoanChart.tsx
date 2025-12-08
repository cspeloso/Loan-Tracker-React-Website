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

function generateAmortizationSchedule(principal: number, annualRate: number, termMonths: number, monthlyPayment: number)
{
    const monthlyRate = annualRate / 100 / 12;

    let balance = principal;

    const schedule: { month:number; balance:number } [] = [];

    for(let month = 1; month <= termMonths; month++)
    {
        const interest = balance * monthlyRate;
        const principalPaid = monthlyPayment - interest;

        balance = balance - principalPaid;

        //  guard against tiny negative numbers at the end
        if(balance < 0) 
            balance = 0;

        schedule.push({ month, balance });
    }

    return schedule;
}

export default function LoanChart({data}: LoanChartProps){

    if(data.length === 0)
            return <p>No loans to chart.</p>;

    const loan = data[0];
    const schedule = generateAmortizationSchedule(loan.principal, loan.interestRate, loan.termInMonths, loan.monthlyPayment);

    const chartData = {
      labels: schedule.map((s) => `Month ${s.month}`),
      datasets: [
        {
            label: `Remaining Balance - ${loan.name}`,
            data: schedule.map((s) => s.balance),
            borderWidth: 2,
            tension: 0.3,
        }
      ], 
    };

    return (
        <div className="LoanChart" style={{maxWidth:600, background: "white", padding:16}}>
            <Line data={chartData} />
        </div>
    );
}