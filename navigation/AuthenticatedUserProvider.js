import React, { useState, createContext, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../config/firebase';

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const dbRef = collection(db, "usuarios");
    onSnapshot(dbRef, docsSnap => {
      setPlayers([]);
      docsSnap.forEach(doc => {
        setPlayers(players => [...players, doc.data()]);
      })
    });
  }, []);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser, players, setPlayers }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};