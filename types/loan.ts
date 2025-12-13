export type LoanBase = {
    name: string,
    principal: number;
    interestRate: number;
    termInMonths: number;
    monthlyPayment: number;
    startDate: string;
};

export type Loan = LoanBase & {
    id?: number;
};