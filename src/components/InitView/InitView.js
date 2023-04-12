import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../utils/constants'
import ButtonPrincipal from '../commons/Buttons/ButtonPrincipal'

const InitView = () => {
  return (
    <View style={styles.container}>
      <ButtonPrincipal
        backgroundColor={colors.secondary}
        text={'Nuevo juego'}
      />
    </View>
  )
}

export default InitView

const styles = StyleSheet.create({
  container:{
      backgroundColor:colors.primary,
      flex:1,
      alignItems:'center',
      justifyContent:'center'
  }
})