export type Bin = {
  id: number;
  type: 'bin';
  latitude: number;
  longitude: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt: string | Date | null;
};
