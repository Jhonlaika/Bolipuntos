import { StyleSheet, Text, View, Image, FlatList } from 'react-native'
import React, { useState} from 'react'
import { useSelector } from 'react-redux';
import { colors, fontFamily } from '../../utils/constants'
import ButtonPrincipal from '../commons/Buttons/ButtonPrincipal'
import TextSimple from '../commons/Text/TextSimple';
import ItemGameMode from './components/ItemGameMode';

const InitView = ({navigation}) => {
  const scoreState = useSelector(state => state.score);
  const [gamesModesVisible, setGamesModesVisible] = useState(false);
  const gameModes = [
    {
      id: 1,
      title: 'Modo Individual',
      description: '¡Demuestra tus habilidades en solitario y busca la victoria en emocionantes rondas!',
      image: require('../../../assets/images/single_game.png')
    },
    {
      id: 2,
      title: 'Modo en Parejas',
      description: '¡Colabora estratégicamente con tu compañero y busca la victoria en equipo!',
      image: require('../../../assets/images/multiplayer_game.png')
    },
    {
      id: 3,
      title: 'Ruleta del Destino',
      description: 'Gira la ruleta al ganar y obtén la oportunidad de hacer que otro jugador gane automáticamente.',
      image: require('../../../assets/images/roulette.png')
    },
  ]
  //functions 
  const handleNewGame = () => {
    setGamesModesVisible(true)
  }
  //components
  const _renderItem = ({ item, index }) =>
  (
    <ItemGameMode item={item} index={index} />
  )
  return (
    <View style={styles.container}>
      {
        gamesModesVisible ?
          <View>
            <View style={{flexDirection:'row',marginTop:30,marginBottom:10}}>
              <TextSimple style={styles.textTitle} text={'Modos de juego'}/>
            </View>
            <FlatList
              contentContainerStyle={{ paddingBottom: 50}}
              numColumns={2}
              data={gameModes}
              renderItem={_renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          :
          <>
            <View style={styles.containerImage}>
              <Image style={styles.logo} resizeMode='contain' source={require('../../../assets/images/logo.png')} />
              <TextSimple style={styles.textLogo} text={'Bolipuntos'} />
            </View>
            <ButtonPrincipal
              action={handleNewGame}
              backgroundColor={colors.secondary}
              text={'Nuevo juego'}
            />
          </>
      }
    </View>
  )
}

export default InitView

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerImage: {
    alignItems: 'center',
    marginBottom: 100
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20
  },
  textTitle:{
    color:colors.white,
    fontFamily:fontFamily.fontFamilyBold,
    fontSize:25
  },
  textLogo: {
    fontFamily: fontFamily.fontFamilyBold,
    fontSize: 22,
    color: colors.white,
  }
})