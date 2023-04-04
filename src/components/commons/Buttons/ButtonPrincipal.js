import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../../../utils/constants'

const ButtonPrincipal = ({ text, disabled,action,width,height,fontSize }) => {
    return (
        <TouchableOpacity
            onPress={()=>action()}
            disabled={disabled}
            style={{ ...styles.container,backgroundColor:disabled ?colors.gray:colors.primary,width: width ? width: 300, height: height ? height : 50 }}>
            <Text style={{...styles.text,fontSize:fontSize?fontSize:20}}>{text}</Text>
        </TouchableOpacity>
    )
}

export default ButtonPrincipal

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    text: {
        color: colors.white,
    }
})