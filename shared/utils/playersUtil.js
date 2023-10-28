export const mapPlayersToKeyValueList = (players, match) => {
  let keyValueList = [];

  players.forEach(player => {
    const exist = match.players.some(p => {
      if (p.apodo === player.apodo) {
        return true;
      }
    })
    if (!exist) {
      keyValueList.push({ key: player.id, value: player.apodo })
    }
  });

  return keyValueList;
}

export const playerAlreadyExist = (playersInMatch, playerID) => playersInMatch.find(player => player.id === playerID);