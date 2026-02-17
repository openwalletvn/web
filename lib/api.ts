export interface Bank {
    id: string;
    name: string;
    full_name: string;
    link: string;
    logo_url: string;
    brand_color?: string;
}

interface BankListResponse {
    success: boolean;
    data: Bank[];
    meta: { total: number };
}

interface BankDetailResponse {
    success: boolean;
    data: Bank;
    meta: { total: number };
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export function getBankImageUrl(logoUrl: string): string {
    return `${apiUrl}${logoUrl}`;
}

export async function getBanks(): Promise<Bank[]> {
    const res = await fetch(`${apiUrl}/api/v1/banks`, {next: {revalidate: 3600}});
    const json = (await res.json()) as BankListResponse;
    if (!json.success) throw new Error('Failed to fetch banks');
    return json.data;
}

export async function getBank(id: string): Promise<Bank> {
    const res = await fetch(`${apiUrl}/api/v1/banks/${id}`, {next: {revalidate: 3600}});
    const json = (await res.json()) as BankDetailResponse;
    if (!json.success) throw new Error(`Failed to fetch bank: ${id}`);
    return json.data;
}
