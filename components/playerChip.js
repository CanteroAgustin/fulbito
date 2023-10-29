import React from 'react';
import { Chip } from "react-native-paper"
import { removeFromTeamAndAddToList } from '../services/matchService';

export default function PlayerChip({ player, handleOnClick }) {

  return <Chip onPress={() => handleOnClick(player)} style={{ margin: 1, width: 'auto' }} mode='outlined'>
    {player.apodo}
  </Chip>
}



