export class Payment {
    id: string;
    custodyPartial: number;
    interestPartial: number;
    totalPartial: number;

    custody: number;
    interest: number;
    total: number;

    typePayment;
    date: Date;

    saldoInterest: number;
    saldoCustody: number;
    saldoTotal: number;

    constructor() {
        this.id = '';
        this.typePayment = '';
        this.custody = 0;
        this.interest = 0;
        this.total = 0;
        this.saldoInterest = 0;
        this.saldoCustody = 0;
        this.saldoTotal = 0;
        this.date = new Date();
    }
}