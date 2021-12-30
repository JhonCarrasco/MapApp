import React, {Ref} from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

interface Props {
  iconName: string
  onPress: () => void
  style: StyleProp<ViewStyle>
}
const Fab = ({iconName, onPress, style}: Props) => {
  return (
    <View style={[style as any]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.blackButton}>
        <Icon
          color="white"
          name={iconName}
          size={35}
          style={{
            left: 1,
          }}
        />
      </TouchableOpacity>
    </View>
  )
}

export default Fab

const styles = StyleSheet.create({
  blackButton: {
    zIndex: 9999,
    height: 50,
    width: 50,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,

    shadowColor: '#cdcbcc',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
})
