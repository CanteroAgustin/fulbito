import { db } from '../config/firebase';
import { setDoc, doc, getDoc } from "firebase/firestore";
import { COLLECTIONS } from '../shared/utils/constants';

const collection = COLLECTIONS.POOL;
const document = "pool";

export function getPool() {
  const docRef = doc(db, collection, doc);
  const docSnap = getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

export function editPool(pool) {
  setDoc(doc(db, collection, Date.now().toString()), { pool });
}
