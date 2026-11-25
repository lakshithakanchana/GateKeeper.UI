export interface GateInVM {
    giid: number;
    goid: number;
    qrcid: number
    itemRefNo: string;
    location?: string;
    gateOutDateTime: Date;
    gateInDateTime: Date;
    delay: number; // In Minutes
}