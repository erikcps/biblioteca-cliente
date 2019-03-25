export class Guarantee {
    id: string;
    code: string;
    brand: string;
    model: string;
    description: string;
    typeGuarantee: string;
    branchOfficeId: string;
    baseValue: string;

    constructor() {
        this.id = '';
        this.code = '';
        this.brand = '';
        this.model =''
        this.description = '';
        this.typeGuarantee = '';
        this.branchOfficeId = "";
        this.baseValue = "";
    }
}