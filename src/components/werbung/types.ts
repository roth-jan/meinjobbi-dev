// shared types and enums for Werbung components
export enum AdvertisementType {
	None = 0,
	Stellenticker = 1,
	Bannerwerbung = 2,
}

export enum WerbungType {
	None = 0,
	Jobbi_StartSeite = 1,
	WebMenu_StartSeite = 2,
	WebMenu_Login = 4,
	WebMenu_Dashboard = 8,
	Anzeigen = 16,
}

export interface City {
	id: number;
	name: string;
	selected: boolean;
}

export interface CostDetail {
	title: string;
	price: number;
}

export interface WizardModel {
	step0: {
		advertisementType: AdvertisementType;
	};
	step1: {
		placementType: WerbungType;
	};
	step2: {
		jobAdId: number | null;
		duration: string;
		hintergrundbild: string;
		topline: string;
		titel: string;
		subtitel: string;
		externeButtonUrl: string;
		buttonName: string;
	};
	step3: {
		localizationRequired: boolean;
		cities: City[];
	};
}

export interface WerbungDto {
	id: number;
	type: WerbungType;
	advertisementType: AdvertisementType;
	duration: string;
	active: boolean;
	isPaid: boolean;
	registrationDate: Date;
	jobTitle: string;
}
