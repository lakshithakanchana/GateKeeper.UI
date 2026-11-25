export interface InTransitVM {
    goid: number;
    itemRefNo?: string;
    from?: string;
    to?: string;
    dateTime: Date;
    delay: number; // In Minutes
}