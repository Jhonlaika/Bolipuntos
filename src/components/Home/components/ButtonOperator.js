import { StyleSheet, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../../../utils/constants'

const ButtonOperator = ({text,index,action,textColor}) => {
    return (
        <TouchableOpacity style={{paddingHorizontal:5}} onPress={() => action(index)}>
            <Text style={{...styles.texButton,color: textColor?textColor :colors.white}}>{text}</Text>
        </TouchableOpacity>
    )
}

export default ButtonOperator

const styles = StyleSheet.create({
    texButton: {
        fontSize: 30
    }
})