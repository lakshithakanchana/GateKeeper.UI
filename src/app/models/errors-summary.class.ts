export class ErrorsSummary {

    errorCode: number = 0;
    errorCodeDesc: string = "Client Side Error";
    errors: string[] = ["Check your internet connection or the internal firewall!"];

    constructor(errorCode?: number, errorCodeDesc?: string, errors?: string[]) {
        if(errorCode !== undefined)
            this.errorCode = errorCode;
        if(errorCodeDesc !== undefined)
            this.errorCodeDesc = errorCodeDesc;
        if(errors !== undefined)
            this.errors = errors;
    }
    
}