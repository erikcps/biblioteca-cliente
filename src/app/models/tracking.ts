export class Tracking {
    id: string;
    date: Date;
    note: string;
    type: string;
    guaranteeIds: any;

    constructor() {
        this.id = '';
        this.date = null;
        this.note = '';
        this.type = '';
        this.guaranteeIds = []
    }
}