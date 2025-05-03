import { atom } from 'jotai';

const locationOffsetAtom = atom<[number, number]>([0, 0]);

export default locationOffsetAtom;
