
export class TaxRate {
    public year: string;
    public data: Array<{
        min: number;
        max: number;
        rate: number;
        base: number;
        description: string;
    }>;
}

