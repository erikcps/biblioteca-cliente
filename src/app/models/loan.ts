export class Loan {
    id: string;
    title: string;
    author: string;
    year: string;
    edited: string;
    language: string;
    fromDate: string;
    content: string;
    pages: number;
    copies: number;
    download: string;
    
    constructor() {
        this.id = '';
        this.title = '';
        this.author =''
        this.year = '';
        this.edited = '';
        this.language = '';
        this.fromDate = '';
        this.content = '';
        this.pages = 0;
        this.copies = 0;
        this.download = '';
    }
}