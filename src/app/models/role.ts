export class Role {
    id: string;
    code: string;
    name: string;
    description: string;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canPrint: boolean;

    constructor() {
        this.id = '';
        this.code = '';
        this.name = '';
        this.description = '';
        this.canCreate = false;
        this.canUpdate = false;
        this.canDelete = false;
        this.canPrint = false;
    }
}