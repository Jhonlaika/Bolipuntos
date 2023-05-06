import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch } from 'react-native'
import React from 'react'
import { colors } from '../../../utils/constants'
import ButtonOperator from './ButtonOperator'


const ItemScore = ({visibleOperator,whiteActive,onEndEditing, title, index, actionAdd, actionRemove, editableInput, onChangeText, value, color, switchActive }) => {
    return (
        <View style={{ alignItems: 'center'}}>
            <Text style={{ ...styles.title, color: color }}>{title}</Text>

            {
                !switchActive &&
                <View style={styles.containerOperator}>
                    {
                        !visibleOperator &&
                        <ButtonOperator index={index} textColor={color} action={actionRemove} text={'-'} />
                    }
                    <TextInput
                        onChangeText={text => whiteActive ?{}: onChangeText(text)}
                        value={value && String(value)}
                        keyboardType='numeric'
                        maxLength={4}
                        onEndEditing={onEndEditing}
                        editable={!editableInput}
                        style={{ ...styles.input, borderColor: color, color: color }} />
                    {
                        !visibleOperator &&
                        <ButtonOperator index={index} textColor={color} action={actionAdd} text={'+'} />
                    }
                </View>
            }
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
        color: colors.black
    },
})