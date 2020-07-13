import { Entity } from './entity';

export interface Service extends Entity {
  //id: string;
  name: string;
  description: string;
  maxFiles?: number;
  image: string;
  supportedExtensions: string[];
  //workingArea: string;
  //attendance: boolean;
  //status: string;
  //extension: string[];
  width: number;
  height: number;
  materials?: string[];
  units?: string[];
  types?: string[];
  colors?: string[];
  thickness?: string[];
  processes?: Processes;
}
export class Processes {
  multi: boolean;
  values: string[];
}
export class Material {
  index: number;
  name: string;
  types: Type[];
}

export class Type {
  name: string;
  colors: any[];
  dimensions: any[];
}

export class SupportedExtensions {}
