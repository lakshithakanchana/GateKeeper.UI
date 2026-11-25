import { User } from "./user.interface";

export interface UserLocationBridge {
    userLocationBridgeId: number;
    locationId: number;
    userId: string;
    
    // virtual properties
    location: Location | null;
    user: User | null;
}