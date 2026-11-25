import { Company } from "./company.interface";
import { QrCode } from "./qr-code.class";
import { User } from "./user.interface";
import { Location } from "./location.interface";
import { DocumentType } from "./document-type.interface";

export class GateOut {

    gateOutId: number       = 0;
    companyId: number       = 0;
    fromLocationId: number  = 0;
    toLocationId: number    = 0;
    documentTypeId: number  = 0;
    createdUserId: string   = '';
    vehicleNo: string           = '';
    driverEpfNo: string         = '';
    driverName: string          = '';
    attachedDocumentNo: string  = '';
    tempAttachmentRef: string   = '';
    attachmentSavePath: string | null = null;
    createdDateTime: Date = new Date('1993-05-01');

    // Virtual Properties
    company: Company | null             = null;
    fromLocation: Location | null       = null;
    toLocation: Location | null         = null;
    documentType: DocumentType | null   = null;
    createdUser: User | null            = null;

    // Additional Virtual Properties
    qrCodeIds: number[] | null  = null;
    qrCodes: QrCode[] | null    = null;

}