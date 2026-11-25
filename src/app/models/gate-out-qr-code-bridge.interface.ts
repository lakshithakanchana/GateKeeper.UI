import { GateOut } from "./gate-out.class";
import { QrCode } from "./qr-code.class";

export interface GateOutQrCodeBridge {
    gateOutQrCodeBridgeId: number;
    gateOutId: number;
    qrCodeId: number;

    // Virtual Properties
    gateOut: GateOut | null;
    qrCode: QrCode | null;
}