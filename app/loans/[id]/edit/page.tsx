import EditLoanClient from "./EditLoanClient";

export default async function EditPage({ params }: { params: Promise<{ id: string }>;}) {

    const { id } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loans/${id}`, { cache: "no-store" });

    if(!res.ok)
    {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to load loan ${id}: ${res.status} ${text}`);
    }

    const text = await res.text();
    if(!text)
        throw new Error(`Loan ${id} returned empty response (${res.status})`)

    const loan = JSON.parse(text);

    return (
        <main>
            <EditLoanClient id={id} initialLoan={loan} />
        </main>
    );
}
