import { Entity } from './entity';

export interface Service extends Entity {
  //id: string;
  name: string;
  description: string;
  maxFiles: number;
  image: string;
  //workingArea: string;
  //attendance: boolean;
  //status: string;
  //extension: string[];
  width: number;
  height: number;
  materials: Material[];
  supportedExtensions: string[];
  units?: string[];
  type?: string[];
  color?: string[];
  thickness?: string[];
  process?: any[];
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
