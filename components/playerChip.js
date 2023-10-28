import React from 'react';
import { Chip } from "react-native-paper"

export default function PlayerChip({ player }) {
  return <Chip style={{ margin: 1, width: 'auto' }} mode='outlined'>
    {player.apodo}
  </Chip >
}



