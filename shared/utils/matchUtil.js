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