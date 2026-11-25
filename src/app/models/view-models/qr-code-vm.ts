export interface QrCodeVM {
    qrcid: number
    itemRefNo: string;
    qty: number;
    createdLocation?: string;
    dateTime: Date;
}