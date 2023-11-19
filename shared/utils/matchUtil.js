export const matchToWhatsappMsg = match => {
  const lineZero = `⚽ ${match.lugar} ${match.fecha}`;
  const lineOne = `👕 Equipo1: ${JSON.stringify(match.team1.map((player) => player.apodo))}`;
  const lineTwo = `🎽 Equipo2: ${JSON.stringify(match.team2.map((player) => player.apodo))}`;
  return encodeURIComponent(`${lineZero}\r\n${lineOne}\r\n${lineTwo}`)
}

export const matchToFinishWhatsappMsg = (match, winner) => {
  const lineZero = `⚽ Termino el partido ${match.lugar} ${match.fecha}`;
  const lineOne = `🏆 Ganador: ${winner}`;
  return encodeURIComponent(`${lineZero}\r\n${lineOne}`)
}

export const toInformPlayerAddedMsg = (match, player) => {
  const lineZero = `${player.apodo} se acaba de sumar al partido 💪`;
  const lineOne = `⚽ ${match.lugar} ${match.fecha}`;
  const lineTwo = `Jugadores: ${JSON.stringify(match.players.map((player) => player.apodo))}`;
  return encodeURIComponent(`${lineZero}\r\n${lineOne}\r\n${lineTwo}`)
}



export const toInformMatchCreatedMsg = (fecha, lugar, user) => {
  const lineZero = `${user.apodo} acaba de armar partido, sumate https://fulbitosecla.web.app/`;
  const lineOne = `⚽ ${fecha} ${lugar}`;
  return encodeURIComponent(`${lineZero}\r\n${lineOne}`)
}