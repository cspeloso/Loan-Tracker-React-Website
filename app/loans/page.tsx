import LoanChart from './LoanChart';
import LoansTable from './LoansTable';

type Loan = {
    id: number;
    name: string;
    principal: number;
    interestRate: number;
    termInMonths: number;
    monthlyPayment: number;
    startDate: string;
};

async function getLoans(): Promise<Loan[]>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loans`, {
        cache: "no-store",
    });

    if(!res.ok)
        throw new Error("Failed to fetch loans");

    return res.json();
}

export default async function LoansPage() {
    const loans = await getLoans();

    return (

        <main style={{padding: 24}}>

            <div className="LoanChart">
                <LoanChart data={loans} />
            </div>

            <h1 style={{fontSize:24, marginBottom:16}}>Your Loans</h1>

            <LoansTable initialLoans={loans} />
            
        </main>
    );
}