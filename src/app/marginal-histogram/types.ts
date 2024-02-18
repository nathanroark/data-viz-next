// export interface DataRecord {
//     [key: string]: string | number;
//   }
  
  // record version of DataRecord
  export type DataRecord = Record<string, string | number>;
  
  export interface BoundedDimensions extends Dimensions {
    boundedWidth: number;
    boundedHeight: number;
}

export interface Dimensions {
    height?: number;
    width?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    histogramMargin: number;
    histogramHeight: number;
    legendWidth: number;
    legendHeight: number;
}

  // export interface Dimensions {
  //   height: number;
  //   width: number;
  //   margin: {
  //     top: number;
  //     right: number;
  //     bottom: number;
  //     left: number;
  //   };
  // }
  
  // export interface BoundedDimensions extends Dimensions {
  //   boundedWidth: number;
  //   boundedHeight: number;
  // }
  
  export type AccessorFunction<DataType> = (d: DataRecord) => DataType;
  export type ScaledAccessorFunction = (d: DataRecord) => number;
  export interface BoundedDimensions extends Dimensions {
    boundedWidth: number;
    boundedHeight: number;
}

// export interface Dimensions {
//     height?: number;
//     width?: number;
//     marginTop?: number;
//     marginBottom?: number;
//     marginLeft?: number;
//     marginRight?: number;
// }