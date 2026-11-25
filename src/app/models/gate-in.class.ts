import { Company } from "./company.interface";
import { GateOut } from "./gate-out.class";
import { Location } from "./location.interface";
import { QrCode } from "./qr-code.class";
import { User } from "./user.interface";

export class GateIn {

    gateInId: number    = 0;
    gateOutId: number   = 0;
    companyId: number   = 0;
    locationId: number  = 0;
    qrCodeId: number    = 0;
    createdUserId: string   = '';
    createdDateTime: Date   = new Date('1993-05-01');
    remarks: string | null  = null;

    // Virtual Properties
    gateOut: GateOut | null     = null;
    company: Company | null     = null;
    location: Location | null   = null;
    qrCode: QrCode | null       = null;
    createdUser: User | null    = null;

}