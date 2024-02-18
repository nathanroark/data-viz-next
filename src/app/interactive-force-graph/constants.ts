import * as d3 from 'd3';
// import { schemeTableau10 } from 'd3-scale-chromatic';

const vercelColors = ['#FF0080', '#0070F3', '#50E3C2', '#F5A623', '#7928CA', '#FF7BD5'];

const poimandresColors = [
  '#d0679d',
  '#5de4c7',
  '#fffac2',
  '#89ddff',
  '#fcc5e9',
  '#add7ff',
  '#a6accd',
];

export const colorScale = d3.scaleOrdinal(poimandresColors.slice());
export const defaultNodeStrokeWidth = 1.5;
export const defaultLinkStrokeWidth = 1.5;
export const highlightColor = '#5de4c7';
export const everythingElseColor = '#add7ff';
export const everythingElseOpacity = 0.2;
export const linkGradientColorStart = '#aaaaaf';
export const linkGradientColorEnd = '#8a8aaf';
// export const linkGradientColorEndInverted = '#2f5359';
