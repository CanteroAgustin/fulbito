import { db } from '../config/firebase';
import { setDoc, doc } from "firebase/firestore";
import { COLLECTIONS } from '../shared/utils/constants';

const collection = COLLECTIONS.PLAYERS;

export function updatePlayer(player) {
  setDoc(doc(db, collection, player.id), { ...player });
}

export function saveUserOnDB(user, position, apodo) {
  setDoc(doc(db, "usuarios", user.id), {
    ...user,
    "apodo": apodo,
    "status": "ACTIVE",
    "estadisticas": {
      "ganados": 0,
      "empatados": 0,
      "perdidos": 0,
      "jugados": 0,
      "puntos": 0,
    },
    rol: [],
    posicion: position
  });
}
