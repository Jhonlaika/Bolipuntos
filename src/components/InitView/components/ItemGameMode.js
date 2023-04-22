import { StyleSheet, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import TextSimple from '../../commons/Text/TextSimple'
import { colors, fontFamily, generateRandomColor } from '../../../utils/constants'
import ButtonPrincipal from '../../commons/Buttons/ButtonPrincipal'

const ItemGameMode = ({ item, action }) => {
    return (
        <TouchableOpacity onPress={()=>action(item)} style={styles.container}>
            <Image resizeMode='contain' style={styles.image} source={item.image} />
            <View style={{...styles.containerText,backgroundColor: item.color}}>
                <TextSimple style={styles.textTitle} text={item.title} />
                <TextSimple style={styles.textDescription} text={item.description} />
            </View>
        </TouchableOpacity>
    )
}

export default ItemGameMode

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 10,
        justifyContent: 'flex-end',
        marginTop:10,
        marginHorizontal:5
        
    },
    containerText: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'center',
        paddingHorizontal:15,
    },
    image: {
        width: 100,
        height: 100,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginTop:30
    },
    textTitle: {
        fontFamily: fontFamily.fontFamilyBold,
        color: colors.white,
        fontSize: 20,
        marginVertical: 10
    },
    textDescription: {
        fontFamily: fontFamily.fontFamilyRegular,
        color: colors.white,
        marginBottom: 30,
        width: 140,
        textAlign:'center'
    }
})