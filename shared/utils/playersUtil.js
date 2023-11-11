export const mapPlayersToKeyValueList = (players, match) => {
  let keyValueList = [];

  players.forEach(player => {
    const exist = checkIfPlayerExist(match, player);
    if (!exist) {
      keyValueList.push({ key: player.id, value: player.apodo })
    }
  });

  return keyValueList;
}

export const playerAlreadyExist = (playersInMatch, playerID) => playersInMatch.find(player => player.id === playerID);

export const checkIfPlayerExist = (match, player) => {
  let exist = false;
  match.players.some(p => {
    if (p.apodo === player.apodo) {
      exist = true;
    }
  })
  if (match.team1) {
    match.team1.some(p => {
      if (p.apodo === player.apodo) {
        exist = true;
      }
    })
  }
  if (match.team2) {
    match.team2.some(p => {
      if (p.apodo === player.apodo) {
        exist = true;
      }
    })
  }
  return exist;
}