import { StyleSheet, Text, View, Image, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { colors, fontFamily, stateInitial } from '../../utils/constants'
import ButtonPrincipal from '../commons/Buttons/ButtonPrincipal'
import TextSimple from '../commons/Text/TextSimple';
import ItemGameMode from './components/ItemGameMode';
import IconAwesome from 'react-native-vector-icons/FontAwesome5';
import { getPlayers, getPlayersPlay, setConfig, setGameMode, setPlayCouples } from '../../state/features/score/reducers';
import { getData, removeValue, storeData } from '../../utils/storage';

const InitView = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const scoreState = useSelector(state => state.score);
  const finishGame = route.params?.finishGame;
  const [gamesModesVisible, setGamesModesVisible] = useState(false);
  const gameModes = [
    {
      id: 1,
      title: 'Modo Individual',
      description: '¡Demuestra tus habilidades en solitario y busca la victoria en emocionantes rondas!',
      image: require('../../../assets/images/single_game.png'),
      color: 'rgb(236,163,36)'
    },
    {
      id: 2,
      title: 'Modo en Parejas',
      description: '¡Colabora estratégicamente con tu compañero y busca la victoria en equipo!',
      image: require('../../../assets/images/multiplayer_game.png'),
      color: 'rgb(254,48,68)'
    },
    {
      id: 3,
      title: 'Ruleta del Destino',
      description: 'Gira la ruleta al ganar y obtén la oportunidad de hacer que otro jugador gane automáticamente.',
      image: require('../../../assets/images/roulette.png'),
      color: 'rgb(134,1,219)'
    },
    {
      id: 4,
      title: 'Eliminación',
      description: 'Los jugadores compiten para evitar quedar en último lugar durante un número determinado de rondas. El jugador con menos puntos es eliminado, hasta que solo queda un ganador.',
      image: require('../../../assets/images/eliminated.jpg'),
      color: 'rgb(200,100,219)'
    },
  ]
  //useEffects
  useEffect(() => {
    getData('@players').then(json => {
      if (json) {
        dispatch(getPlayers(json))
      }
    }).catch(
      err => {
        console.log(err)
      }
    )
    getData('@playersPlay').then(json => {
      if (json) {
        dispatch(getPlayersPlay(json))
      }
    }).catch(
      err => {
        console.log(err)
      }
    )
    getData('@config').then(json => {
      if (json) {
        dispatch(setConfig(json))
      }
    }).catch(
      err => {
        console.log(err)
      }
    )
  }, [])

  useEffect(() => {
    if (scoreState.playersPlay.length === 0 && finishGame) {
      setGamesModesVisible(false)
    }
  }, [scoreState.playersPlay])

  //functions 
  const handleNewGame = () => {
    setGamesModesVisible(true)
    dispatch(setConfig({
      ...stateInitial
    }))
    storeData({
      ...stateInitial
    }, '@config')
    if (scoreState.playersPlay.length > 0) {
      dispatch(getPlayersPlay([]))
      removeValue('@playersPlay')
    }
  }
  const handleSaveGame = () => {
    navigation.navigate('Score')
  }
  const handleAbout = () => {
    navigation.navigate('About')
  }
  const handleActionItem = (item) => {
    if (item.id === 1) {
      navigation.navigate('Home')
      dispatch(setGameMode('single'))
      dispatch(setPlayCouples(false))
    } else if (item.id === 2) {
      navigation.navigate('Home')
      dispatch(setGameMode('multiplayer'))
      dispatch(setPlayCouples(true))
    } else if(item.id === 3) {
      navigation.navigate('Home')
      dispatch(setGameMode('roulette'))
      dispatch(setPlayCouples(false))
    }else{
      navigation.navigate('Home')
      dispatch(setGameMode('eliminated'))
      dispatch(setPlayCouples(false))
    }
  }
  //components
  const _renderItem = ({ item, index }) =>
  (
    <ItemGameMode action={handleActionItem} navigation={navigation} item={item} index={index} />
  )
  return (
    <View style={styles.container}>
      {
        gamesModesVisible ?
          <View>
            <View style={{ marginLeft: 10, flexDirection: 'row', width: '70%', marginTop: 30, marginBottom: 10, alignItems: 'center', justifyContent: 'space-between' }}>
              <IconAwesome onPress={() => setGamesModesVisible(false)} name={'arrow-left'} size={30} color={colors.white} />
              <TextSimple style={styles.textTitle} text={'Modos de juego'} />
            </View>
            <FlatList
              contentContainerStyle={{ paddingBottom: 50 }}
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
            {
              scoreState.playersPlay.length > 0 &&
              <View style={{ marginTop: 10 }}>
                <ButtonPrincipal
                  action={handleSaveGame}
                  backgroundColor={colors.secondary}
                  text={'Continuar juego'}
                />
              </View>
            }
            <View style={{ marginTop: 10 }}>
              <ButtonPrincipal
                action={handleAbout}
                backgroundColor={colors.secondary}
                text={'Acerca de'}
              />
            </View>
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
  textTitle: {
    color: colors.white,
    fontFamily: fontFamily.fontFamilyBold,
    fontSize: 25
  },
  textLogo: {
    fontFamily: fontFamily.fontFamilyBold,
    fontSize: 22,
    color: colors.white,
  }
})