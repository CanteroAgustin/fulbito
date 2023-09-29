import { useContext } from 'react'
import { StyleSheet, View } from 'react-native';
import { Text, Avatar, Surface, Badge } from 'react-native-paper';
import { AuthenticatedUserContext } from '../../navigation/AuthenticatedUserProvider';

export default function Players(props) {
  const { players } = useContext(AuthenticatedUserContext);

  return (
    <View style={styles.container}>
      {players.map(item => {
        return (
          <Surface style={styles.surface} elevation={4} key={item?.id}>
            <Avatar.Image style={styles.avatar} {...props} size={48} source={{
              uri: item?.picture,
            }} />
            <View style={styles.cardContainer}>
              <Text style={styles.textApodo}>{item?.apodo} - {item?.posicion}</Text>
              <View style={styles.badgesContainer}>
                <Badge size={25} style={styles.badge}>J: {item?.estadisticas?.jugados}</Badge>
                <Badge size={25} style={styles.badge}>G: {item?.estadisticas?.ganados}</Badge>
                <Badge size={25} style={styles.badge}>E: {item?.estadisticas?.empatados}</Badge>
                <Badge size={25} style={styles.badge}>P: {item?.estadisticas?.perdidos}</Badge>
              </View>
            </View>
            <Badge size={25} style={styles.badgePuntos}>Puntos: {item?.estadisticas?.puntos}</Badge>
          </Surface>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  surfaceWeb: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    padding: 8,
    alignItems: 'center',
    borderRadius: 10,
    margin: 5,
    minWidth: 500,
    maxWidth: 700
  },
  surface: {
    display: 'flex',
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    borderRadius: 10,
    margin: 5
  },
  avatar: {
    alignSelf: 'flex-start'
  },
  textApodo: {
    margin: 2,
    fontWeight: '500'
  },
  cardContainer: {
    marginLeft: 10
  },
  badgesContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  badgePuntos: {
    alignSelf: 'center',
    marginLeft: 'auto',
    backgroundColor: '#1B5E20'
  },
  badge: {
    margin: 1,
    backgroundColor: '#A5D6A7'
  }
});
