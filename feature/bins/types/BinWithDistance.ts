import { Bin } from './Bin';

export type BinWithDistance = Bin & {
  distance: number | null; // in meters
};
