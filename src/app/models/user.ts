export class User {
    id: String;
    username: string;
    password: String;
    profile: any;
    rolId: number;
    branchOfficeId: number;
    modulesIds: number[];

    constructor() {
        this.id = "";
        this.username = "";
        this.password = "";
        this.profile = null;
        this.branchOfficeId = null;
        this.rolId = -1;
        this.modulesIds = [];
    }
}