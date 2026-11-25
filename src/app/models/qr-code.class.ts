import { Location } from "./location.interface";
import { User } from "./user.interface";

export class QrCode {

    qrCodeId: number            = 0;
    currentLocationId: number   = 0;
    createdUserId: string   = '';
    itemRefNo: string       = '';
    itemSpecs: string       = '';
    qty: number             = 1;
    qrCodeText: string      = '';
    active: boolean         = true;
    createdDateTime: Date   = new Date('1993-05-01');

    // Virtual Properties
    createdUser: User | null            = null;
    currentLocation: Location | null    = null;

}