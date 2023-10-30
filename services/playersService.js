import { NUMBERS, POINTS, WINNER } from '../shared/utils/constants';
import { UpdatePlayer } from '../repository/players';

export function setPoints(match, winner, players) {
  switch (winner) {
    case WINNER.TEAM_ONE:
      setPointsToWinner(match.team1, POINTS.THREE, players);
      setLooser(match.team2, players);
      break;
    case WINNER.TEAM_TWO:
      setPointsToWinner(match.team2, POINTS.THREE, players);
      setLooser(match.team1, players);
      break;
    case WINNER.TIE:
      setPointsToWinner(match.team1.concat(match.team2, POINTS.ONE), POINTS.ONE, players);
      break;
    default:
      console.log("error");
      break;
  }
}

function setPointsToWinner(teamWinner, points, players) {
  teamWinner.forEach(playerWinner => {
    players.forEach(player => {
      if (playerWinner.id === player.id) {
        player.estadisticas.jugados += NUMBERS.ONE;
        player.estadisticas.puntos += points;
        if (points === POINTS.THREE) {
          player.estadisticas.ganados += NUMBERS.ONE;
        } else {
          player.estadisticas.empatados += NUMBERS.ONE;
        }
        UpdatePlayer(player);
      }
    })
  });
}

function setLooser(teamLooser, players) {
  teamLooser.forEach(looser => {
    players.forEach(player => {
      if (looser.id === player.id) {
        player.estadisticas.perdidos += NUMBERS.ONE;
        player.estadisticas.jugados += NUMBERS.ONE;
        UpdatePlayer(player);
      }
    })
  });
}