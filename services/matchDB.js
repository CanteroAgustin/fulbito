import { db } from '../config/firebase';
import { setDoc, doc } from "firebase/firestore";
import { playerAlreadyExist } from '../shared/utils/playersUtil';

export function RemoveFromPlayerList(match, playerID) {
  const newPlayersList = match.players.filter(player => {
    if (player.id !== playerID) {
      return player;
    }
  });
  match.players = newPlayersList;

  setDoc(doc(db, "matches", match.id), {
    ...match
  });
}

export function AddToPlayerList(match, player) {
  if (!playerAlreadyExist(match.players, player.id)) {
    match.players.push(player);
    setDoc(doc(db, "matches", match.id), { ...match });
  }
}