import { StyleSheet, Text, View,TextInput } from 'react-native'
import React from 'react'
import { colors } from '../../../utils/constants'
import ButtonOperator from './ButtonOperator'

const ItemScore = ({ title,index,actionAdd,actionRemove,editableInput,onChangeText,value,color}) => {
    return (
        <View style={{alignItems:'center'}}>
            <Text style={{ ...styles.title,color:color}}>{title}</Text>
            <View style={styles.containerOperator}>
                <ButtonOperator index={index} textColor={color} action={actionRemove} text={'-'} />
                <TextInput
                    onChangeText={onChangeText}
                    value={value && String(value)}
                    keyboardType='numeric'
                    maxLength={4}
                    editable={!editableInput}
                    style={{ ...styles.input,borderColor:color,color:color}} />
                <ButtonOperator index={index} textColor={color} action={actionAdd} text={'+'} />
            </View>
        </View>
    )
}

export default ItemScore

const styles = StyleSheet.create({
    title: {
        color: colors.white,
        fontSize: 18
    },
    containerOperator: {
        flexDirection: 'row',
        marginTop: 15,
    },
    input: {
        borderBottomWidth: 1,
        width: '60%',
        textAlign: 'center',
        marginHorizontal: 15,
        fontSize: 20,
        color:colors.black
      },
})