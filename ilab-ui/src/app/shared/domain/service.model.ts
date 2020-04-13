import { Entity } from './entity';

export interface Service extends Entity {
  id: string;
  name: string;
  description: string;
  maxFiles: number;
  workingArea: string;
  attendance: boolean;
  status: string;
  extension: string[];
  materials: Material[];
  supportedExtensions: any[];
  units: any[];
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
