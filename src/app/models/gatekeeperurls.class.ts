export class GateKeeperUrls{
    static baseUrl: string      = "https://vm1.anunine.com:45000/GateKeeper.API/api/";
    // static baseUrl: string      = "https://localhost:7285/api/";
    static loginUrl: string        = this.baseUrl + "auth/login";
    static registerUrl: string     = this.baseUrl + "auth/register";

    static qrCodesUrl: string     = this.baseUrl + "qrcodes";
    static qrCodesAsSuperUrl: string     = this.baseUrl + "qrcodes/assuper";
    static inTransitsUrl: string     = this.baseUrl + "qrcodes/intransits";
    static gateOutsUrl: string     = this.baseUrl + "gateouts";
    static gateOutAttachmentUploadUrl: string = this.gateOutsUrl + "/attach"
    static gateOutAttachmentDownloadUrl: string = this.gateOutsUrl + "/attachments"
    static gateOutFromQrIdIfInTransitUrl: string     = this.baseUrl + "gateouts/qrc";
    static gateInsUrl: string     = this.baseUrl + "gateins";

    static companiesUrl: string     = this.baseUrl + "companies";
    static companiesAsSuperUrl: string     = this.baseUrl + "companies/assuper";
    static locationsUrl: string     = this.baseUrl + "locations";
    static locationsSelfUrl: string     = this.baseUrl + "locations/self";
    static locationsAsSuperUrl: string     = this.baseUrl + "locations/assuper";
    static documentTypesUrl: string     = this.baseUrl + "documenttypes";
    static documentTypesAsSuperUrl: string     = this.baseUrl + "documenttypes/assuper";
}