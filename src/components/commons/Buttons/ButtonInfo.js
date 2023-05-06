import { StyleSheet,TouchableOpacity} from 'react-native'
import React from 'react'
import IconAwesome from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../utils/constants';


const ButtonInfo = ({colorIcon,showModalInfo,title}) => {
  return (
        <TouchableOpacity style={styles.icon} onPress={() => showModalInfo(title)}>
            <IconAwesome size={20} color={colorIcon ? colorIcon : colors.white}  name='info-circle' />
        </TouchableOpacity>
  )
}

export default ButtonInfo

const styles = StyleSheet.create({
    icon: {
        position: 'absolute',
        left: 10,
        top:10,
    },
})