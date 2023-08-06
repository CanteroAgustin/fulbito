import Constants from "expo-constants"
import { StyleSheet, Text } from "react-native";

const version = Constants.manifest.version

export default function Version() {

  return (<Text style={styles.version}>
    Version: {version}
  </Text>)
}

const styles = StyleSheet.create({
  version: {
    fontSize: 10,
    paddingLeft: 10,
    textAlignVertical: 'bottom'
  }
});