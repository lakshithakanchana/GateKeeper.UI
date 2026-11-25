import { Company } from "./company.interface";

export interface Location {
    locationId: number;
    companyId: number;
    locationName: string;
    active: boolean;

    //virtual properties
    company: Company | null;
}