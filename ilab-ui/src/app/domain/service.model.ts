export class Service {
  id: string;
  name: string;
  description: string;
  maxFiles: number;
  workingArea: string;
  status: string;
  extension: string[];
  materials: Material[];
  supportedExtensions: any[];
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
// export const SERVICES: Service[] = [
//   { id: '1', name: 'Laser Cutting',
//    description: 'Computer-controlled cutting machine used for cutting various hard materials.',
//    status: 'available',
//    serviceDimension: '',
//    filenumber: 2,
//    extension: ['aaa', 'bb'],
//    material: [
//      {id: '1', name: 'material1', type: {id: 5, name: 'type1', color: ['red', 'green'], dimension: ['2*3', '5*6']}},
//      {id: '2', name: 'material2', type: {id: 7, name: 'type1', color: ['red', 'green'], dimension: ['2*3', '5*6']}},
//      {id: '3', name: 'material3', type: {id: 9, name: 'type1', color: ['red', 'green'], dimension: ['2*3', '5*6']}}
//    ],
//    },

//   { id: '2', name: '3D Printing',
//    description: 'Computer-controlled cutting machine used for cutting various hard materials.',
//    status: 'available',
//    serviceDimension: '',
//    filenumber: 2,
//    extension: ['aaa', 'bb'],
//    material: [
//      // tslint:disable-next-line:max-line-length
//      {id: '1', name: 'material1', type: {id: 5, name: 'type1', color: [{id: 3, name: 'red'}, {id: 5, name: 'green'}], dimension: ['2*3', '5*6']}},
//      // tslint:disable-next-line:max-line-length
//      {id: '2', name: 'material2', type: {id: 7, name: 'type1', color: [{id: 3, name: 'blue'}, {id: 5, name: 'black'}], dimension: ['2*3', '5*6']}},
//      // tslint:disable-next-line:max-line-length
//      {id: '3', name: 'material3', type: {id: 9, name: 'type1', color: [{id: 3, name: 'yellow'}, {id: 5, name: 'gray'}], dimension: ['2*3', '5*6']}}
//    ],

//    },

//   { id: '3', name: '3D scanning',
//     description: 'Captures 3D model of medium to large size objects with high efficiency.' ,
//     status: 'available',
//     serviceDimension: '',
//     filenumber: 2,
//     extension: ['aaa', 'bb'],
//     material: [
//       // tslint:disable-next-line:max-line-length
//       {id: '1', name: 'material1', type: {id: 5, name: 'type1', color: [{id: 3, name: 'red'}, {id: 5, name: 'green'}], dimension: ['2*3', '5*6']}},
//       // tslint:disable-next-line:max-line-length
//       {id: '2', name: 'material2', type: {id: 7, name: 'type1', color:  [{id: 3, name: 'blue'}, {id: 5, name: 'black'}], dimension: ['2*3', '5*6']}},
//       // tslint:disable-next-line:max-line-length
//       {id: '3', name: 'material3', type: {id: 9, name: 'type1', color: [{id: 3, name: 'yellow'}, {id: 5, name: 'gray'}], dimension: ['2*3', '5*6']}}
//     ],

//   }
// ];
