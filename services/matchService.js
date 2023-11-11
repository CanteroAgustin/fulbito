import { checkIfPlayerExist, playerAlreadyExist } from '../shared/utils/playersUtil';
import { TEAMS } from '../shared/utils/constants';
import { UpdateMatch, setWinner } from '../repository/matchRepository';
import { setPoints } from './playersService';
import { matchToFinishWhatsappMsg } from '../shared/utils/matchUtil';
import { shareToWhatsApp } from './whatsappService';

export function RemoveFromPlayerList(match, playerID) {
  const newPlayersList = match.players.filter(player => {
    if (player.id !== playerID) {
      return player;
    }
  });
  match.players = newPlayersList;

  UpdateMatch(match);
}

export function AddToPlayerList(match, player) {
  if (!checkIfPlayerExist(match, player)) {
    match.players.push(player);
    UpdateMatch(match);
  }
}

export function removeFromTeamAndAddToList(team, player, match, teamName) {
  team = team.filter(p => p.id != player.id);
  if (teamName == "Equipo 1") {
    match.team1 = team;
  } else {
    match.team2 = team;
  }
  match.players.push(player);
  UpdateMatch(match);
}

export function addPlayerToTeamAndRemoveFromList(match, player, team) {
  let teamToUpdate = match.team1;
  let shouldUpdateMatch = false;

  if (team != TEAMS.TEAM_ONE) {
    teamToUpdate = match.team2;
  };

  if (teamToUpdate && !playerAlreadyExist(teamToUpdate, player.id)) {
    teamToUpdate.push(player);
    shouldUpdateMatch = true;
  };

  if (!teamToUpdate) {
    match[team] = [{ ...player }];
    shouldUpdateMatch = true;
  };

  if (shouldUpdateMatch) {
    match.players = match.players.filter(p => p.id !== player.id);
    UpdateMatch(match);
  };
}

export function finishMatch(match, winner, players) {
  match.status = 'terminado';
  setWinner(match, winner, players);
  setPoints(match, winner, players);
  shareToWhatsApp(matchToFinishWhatsappMsg(match, winner));
}


