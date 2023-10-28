import { db } from '../config/firebase';
import { setDoc, doc } from "firebase/firestore";
import { COLLECTIONS } from '../shared/utils/constants';

const matchCollection = COLLECTIONS.MATCHES;

export function UpdateMatch(match) {
  setDoc(doc(db, matchCollection, match.id), { ...match });
}