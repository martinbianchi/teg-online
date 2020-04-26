
export interface Country {
    name: string;
    continent: string;
    ownerId: string;
    armies: number;
    lockedArmies: number;
    rockets: number;
    borderingCountries: string[];
}