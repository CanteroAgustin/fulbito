import { db } from '../config/firebase';
import { setDoc, doc } from "firebase/firestore";
import { COLLECTIONS } from '../shared/utils/constants';

const collection = COLLECTIONS.PLAYERS;

export function UpdatePlayer(player) {
  setDoc(doc(db, collection, player.id), { ...player });
}

