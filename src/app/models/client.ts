export class Client {
    id: string;
    sinNit: string;
    nameToInvoice: string;
    typeClient: string;
    profile: any;
    code: string;

    constructor() {
        this.id = '';
        this.sinNit = '';
        this.nameToInvoice =''
        this.typeClient = '';
        this.profile = null;
        this.code = '';
    }
}