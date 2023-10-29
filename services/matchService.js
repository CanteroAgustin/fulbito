import { playerAlreadyExist } from '../shared/utils/playersUtil';
import { TEAMS } from '../shared/utils/constants';
import { UpdateMatch } from '../repository/matchRepository';

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
  if (!playerAlreadyExist(match.players, player.id)) {
    match.players.push(player);
    UpdateMatch(match);
  }
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