import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../../../utils/constants'
import ButtonOperator from './ButtonOperator'
import IconAwesome from 'react-native-vector-icons/FontAwesome5';


const ItemScore = ({ colorIcon,showModalInfo, info=true, visibleOperator, onEndEditing, title, index, actionAdd, actionRemove, editableInput, onChangeText, value, color }) => {
    return (
        <View style={{ alignItems: 'center' }}>
            {
                info &&
                <TouchableOpacity onPress={()=>showModalInfo(title)} style={styles.icon} >
                    <IconAwesome size={20} color={colorIcon ? colorIcon : colors.white} name='info-circle' />
                </TouchableOpacity>
            }
            <Text style={{ ...styles.title, color: color }}>{title}</Text>
            <View style={styles.containerOperator}>
                {
                    !visibleOperator &&
                    <ButtonOperator index={index} textColor={color} action={actionRemove} text={'-'} />
                }
                <TextInput
                    onChangeText={onChangeText}
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
        </View>
    )
}

export default ItemScore

const styles = StyleSheet.create({
    title: {
        color: colors.white,
        fontSize: 18
    },
    icon: {
        position: 'absolute',
        left: 0
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