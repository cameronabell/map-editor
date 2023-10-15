import { PathStateEnum } from "./PathStateEnum";

export interface Path {
  name: string;
  description: string;
  category: string;
  activities: string[];
  suitability: string[];
  attractions: string[];
  tags: string[];
  path: google.maps.LatLngLiteral[];
  entryPoints: google.maps.LatLngLiteral[];
  difficulty: string;
  length: number;
  elevationGain: number;
  routeType: string;
  state: PathStateEnum;
  specialStateText?: string;
  iconClass: string;
}
