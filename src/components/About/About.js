import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import TextSimple from '../commons/Text/TextSimple'

const About = () => {
    return (
        <View style={styles.container}>
            <View style={styles.containerImage}>
                <Image style={styles.logo} resizeMode='contain' source={require('../../../assets/images/logo.png')} />
                <TextSimple style={styles.textLogo} text={'Bolipuntos'} />
                <TextSimple style={styles.textLogo} text={'0.0.1'} />
            </View>
            <TextSimple style={{...styles.textLogo,marginTop:20}} text={'Licencias'} />
            <TextSimple style={{...styles.textLogo,marginTop:20}} text={'<a href="https://www.flaticon.com/free-icons/frog" title="frog icons">Frog icons created by Freepik - Flaticon</a>'} />
        </View>
    )
}

export default About

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal:20
    },
    containerImage: {
        alignItems: 'center',
        marginTop:20
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20
    },

})