export class Patient {
    constructor(
        public id: string,
        public tcId: string,
        public name: string,
        public surname: string,
        public gender: string,
        public dateOfBirth: Date,
        public opDescription: string,
        public opDate: Date,
        public imageUrlPatient: string,
        // public imageUrlDiagram: string,
        public userId: string
    ) {}
}