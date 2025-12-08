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
            <h1 style={{fontSize:24, marginBottom:16}}>Loans</h1>

            <table border={1} cellPadding={8} cellSpacing={0}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Principal</th>
                        <th>Interest Rate</th>
                        <th>Term (Months)</th>
                        <th>Monthly Payment</th>
                        <th>Start Date</th>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}