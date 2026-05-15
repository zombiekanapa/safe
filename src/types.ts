/**
 * Core types for Szczecin SafePoint Navigator
 */

export type MarkerStatus = 'adminVerified' | 'userProposed' | 'officialGovernmentVerified';

export type MarkerType = 'undergroundParking' | 'undergroundStore' | 'subwayStation' | 'shelter' | 'other';

export interface ShelterMarker {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  iconType: 'projectLogo' | 'emergencyIcon' | 'officialVerifiedIcon';
  status: MarkerStatus;
  type: MarkerType;
  availability: string;
  adminNotes?: string;
  verifiedByGov: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  username?: string;
  phoneNumber?: string;
  role: 'unregistered' | 'registered' | 'publicAdmin' | 'admin';
  subscribedToAlerts: boolean;
  createdAt: any;
}

export interface OfflineContent {
  id: string;
  title: string;
  type: 'mapSnapshot_A' | 'mapSnapshot_B' | 'textList' | 'pdf' | 'audio' | 'txt';
  fileURL: string;
  version: string;
  language: 'PL' | 'EN';
  description: string;
  targetAudience: string[];
  updatedAt: any;
}
