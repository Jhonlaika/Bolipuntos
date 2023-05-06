import { StyleSheet, View, Switch, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { colors } from '../../utils/constants'
import { addEmpty, addNumberPlayerWinRandom, addNumberRoundsEliminated, addPlayer, addPlayersPlay, addTotal, onChangeEmpty, onChangeNumberPlayerWinRandom, onChangeNumberRoundsEliminated, onChangePlayers, onChangeTotal, removeEmpty, removeNumberPlayerWinRandom, removeNumberRoundsEliminated, removePlayer, removeTotal, setActiveNumberPlayerWinRandom, setNoPlayer, setPlayCouples, setRandomEmpty } from '../../state/features/score/reducers';
import ButtonPrincipal from '../commons/Buttons/ButtonPrincipal';
import ItemScore from './components/ItemScore';
import ModalInformation from '../commons/Modal/ModalInformation';
import ButtonInfo from '../commons/Buttons/ButtonInfo';

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const scoreState = useSelector(state => state.score);
  const [showModalInfo, setShowModalInfo] = useState(false)
  const [focusTitle, setFocusTitle] = useState(false)
  const { numberPlayers, numberTotal, numberEmpty, numberPlayerWinRandom, activeNumberPlayerWinRandom, numberRoundsEliminated } = scoreState;

  //functions
  //players
  const handleChangePlayers = (value) => {
    const numberValue = Number(value);
    if (!isNaN(numberValue)) {
      dispatch(onChangePlayers(parseInt(numberValue)));
    }
  }
  const handleRemovePlayer = () => {
    if (numberPlayers > 0) {
      dispatch(removePlayer())
    }
  }
  const handleAddPlayer = () => {
    dispatch(addPlayer())
  }
  //Total
  const handleChangeTotal = (value) => {
    const numberValue = Number(value);
    if (!isNaN(numberValue)) {
      dispatch(onChangeTotal(parseInt(numberValue)));
    }
  }
  const handleRemoveTotal = () => {
    if (numberPlayers > 0) {
      dispatch(removeTotal())
    }
  }
  const handleAddTotal = () => {
    dispatch(addTotal())
  }
  //Empty
  const handleChangeEmpty = (value) => {
    const numberValue = Number(value);
    if (!isNaN(numberValue)) {
      dispatch(onChangeEmpty(parseInt(numberValue)));
    }

  }
  const handleRemoveEmpty = () => {
    if (numberPlayers > 0) {
      dispatch(removeEmpty())
    }
  }
  const handleAddEmpty = () => {
    dispatch(addEmpty())
  }
  //eliminated
  const handleEliminatedRounds = (value) => {
    const numberValue = Number(value);
    if (!isNaN(numberValue)) {
      dispatch(onChangeNumberRoundsEliminated(parseInt(numberValue)));
    }
  }
  const handleRemoveEliminatedRounds = () => {
    if (numberRoundsEliminated > 0) {
      dispatch(removeNumberRoundsEliminated())
    }
  }
  const handleAddEliminatedRounds = () => {
    dispatch(addNumberRoundsEliminated())
  }
  //NumberPlayerWin
  const handleChangeNumberPlayerWinRandom = (value) => {
    const numberValue = Number(value);
    if (!isNaN(numberValue)) {
      dispatch(onChangeNumberPlayerWinRandom(parseInt(numberValue)));
    }
  }
  const handleRemoveNumberPlayerWinRandom = () => {
    if (numberPlayerWinRandom > 0) {
      dispatch(removeNumberPlayerWinRandom())
    }
  }
  const handleAddNumberPlayerWinRandom = () => {
    dispatch(addNumberPlayerWinRandom())
  }
  const handleSetNoPlayer = () => {
    dispatch(setNoPlayer())
  }
  const handleActiveTextInput = () => {
    dispatch(setActiveNumberPlayerWinRandom(!activeNumberPlayerWinRandom))
  }
  //handleForm
  const handleForm = () => {
    if (scoreState.playCouples) {
      if (scoreState.numberPlayers > 3 && scoreState.numberPlayers % 2 === 0) {

        let arrayPairs = [];

        for (let i = 1; i <= scoreState.numberPlayers / 2; i++) {
          arrayPairs.push({ pair: i });
          arrayPairs.push({ pair: i });
        }
        dispatch(addPlayersPlay(arrayPairs))
        navigation.navigate('Player')
      } else {
        alert('Para jugar en parejas, se debe elegir el número correcto de jugadores.')
      }
    } else {
      dispatch(addPlayersPlay(Array(scoreState.numberPlayers).fill(null)))
      navigation.navigate('Player')
    }
  }
  const handleSetRandomEmpty = () => {
    dispatch(setRandomEmpty())
  }
  const handlePlayCouples = () => {
    dispatch(setPlayCouples(!scoreState.playCouples))
  }
  const handleShowModalInfo = (title) => {
    setFocusTitle(title)
    setShowModalInfo(!showModalInfo)
  }
  const handleTextModal = () => {
    if (focusTitle === 'Cantidad de jugadores') {
      return 'Indica la cantidad de jugadores y asegúrate de contar con suficientes participantes. Así podrás disfrutar del juego sin complicaciones desde el inicio.'
    } else if (focusTitle === 'Puntos a ganar') {
      return 'Escribe la cantidad de puntos necesarios para ganar la partida. Ten en cuenta que el puntaje elegido puede afectar la duración del juego, así que elige sabiamente. ¡Que empiece la diversión!'
    } else if (focusTitle === 'Penalización') {
      return 'Escribe la cantidad de puntos a descontar si un jugador no hace puntos en una ronda. También puedes habilitar la opción para sortear estos puntos y que el limite sea los puntos escritos. Recuerda que esta elección puede impactar en el desarrollo del juego, ¡elige sabiamente y a disfrutar!.'
    } else if (focusTitle === 'Jugar en parejas') {
      return 'Activar el modo en parejas, ten en cuenta que para jugar en parejas se necesitan al menos 4 jugadores.'
    }
    else if (focusTitle === 'Opción ninguno') {
      return 'Puedes activar opcionalmente la opción de que en los sorteos ninguno de los jugadores gane.'
    }
    else if (focusTitle === 'Rondas para eliminar') {
      return 'Ingrese el número de rondas que se deben jugar para eliminar al jugador con menos puntos.'
    }
    else {
      return 'Indica la cantidad de sorteos que se realizan durante el juego, cada vez que un jugador gana.'
    }
  }
  return (
    <View style={styles.root}>
      <ModalInformation handleTextModal={handleTextModal} isVisible={showModalInfo} setModalVisible={handleShowModalInfo} />
      <View style={{ alignItems: 'center', height: '90%' }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 80, alignItems: 'center' }}>
          <View style={styles.containerScore}>
            <ButtonInfo title={'Cantidad de jugadores'} showModalInfo={handleShowModalInfo} colorIcon={colors.primary} />
            <ItemScore
              color={colors.black}
              colorIcon={colors.primary}
              title={'Cantidad de jugadores'}
              actionAdd={handleAddPlayer}
              actionRemove={handleRemovePlayer}
              onChangeText={handleChangePlayers}
              value={numberPlayers}
            />
          </View>
          {
            scoreState.gameMode !== 'eliminated' &&
            <View style={styles.containerScore}>
              <ButtonInfo title={'Puntos a ganar'} showModalInfo={handleShowModalInfo} colorIcon={colors.primary} />
              <ItemScore
                color={colors.black}
                colorIcon={colors.primary}
                showModalInfo={handleShowModalInfo}
                title={'Puntos a ganar'}
                actionAdd={handleAddTotal}
                actionRemove={handleRemoveTotal}
                onChangeText={handleChangeTotal}
                value={numberTotal}
              />
            </View>
          }
          <View style={styles.containerScore}>
            <ButtonInfo title={'Penalización'} showModalInfo={handleShowModalInfo} colorIcon={colors.primary} />
            <View>
              <ItemScore
                color={colors.black}
                colorIcon={colors.primary}
                showModalInfo={handleShowModalInfo}
                title={'Penalización'}
                actionAdd={handleAddEmpty}
                actionRemove={handleRemoveEmpty}
                onChangeText={handleChangeEmpty}
                value={numberEmpty}
              />
              <View style={{ marginTop: 20, alignSelf: 'center', alignItems: 'center', width: '80%', justifyContent: 'space-between', flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, color: colors.black }}>Sortear penalización</Text>
                <Switch
                  trackColor={{ false: '#767577', true: colors.primary }}
                  thumbColor={scoreState.randomEmpty ? colors.white : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={handleSetRandomEmpty}
                  value={scoreState.randomEmpty}
                />
              </View>
            </View>
          </View>
          {
            scoreState.gameMode === 'eliminated' &&
            <View style={styles.containerScore}>
              <ButtonInfo title={'Rondas para eliminar'} showModalInfo={handleShowModalInfo} colorIcon={colors.primary} />
              <ItemScore
                color={colors.black}
                colorIcon={colors.primary}
                showModalInfo={handleShowModalInfo}
                title={'Rondas para eliminar'}
                actionAdd={handleAddEliminatedRounds}
                actionRemove={handleRemoveEliminatedRounds}
                onChangeText={handleEliminatedRounds}
                value={numberRoundsEliminated}
              />
            </View>
          }
          {
            scoreState.gameMode === 'roulette' &&
            <>
              <View style={styles.containerScore}>
                <ButtonInfo title={'Numero de sorteos'} showModalInfo={handleShowModalInfo} colorIcon={colors.primary} />
                <ItemScore
                  color={colors.black}
                  colorIcon={colors.primary}
                  showModalInfo={handleShowModalInfo}
                  title={'Numero de sorteos'}
                  switchActive={!activeNumberPlayerWinRandom}
                  actionAdd={handleAddNumberPlayerWinRandom}
                  actionRemove={handleRemoveNumberPlayerWinRandom}
                  onChangeText={handleChangeNumberPlayerWinRandom}
                  value={numberPlayerWinRandom}
                />
                <Switch
                  trackColor={{ false: '#767577', true: colors.primary }}
                  thumbColor={activeNumberPlayerWinRandom ? colors.white : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  style={{ position: 'absolute', right: 30, top: 20 }}
                  onValueChange={handleActiveTextInput}
                  value={activeNumberPlayerWinRandom}
                />
              </View>
              <View style={{ ...styles.containerScore, flexDirection: 'row' }}>
                <ButtonInfo title={'Opción ninguno'} showModalInfo={handleShowModalInfo} colorIcon={colors.primary} />
                <Text style={{ fontSize: 20, color: colors.black }}>Opción ninguno</Text>
                <Switch
                  trackColor={{ false: '#767577', true: colors.primary }}
                  thumbColor={scoreState.noPlayer ? colors.white : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  style={{ position: 'absolute', right: 30 }}
                  onValueChange={handleSetNoPlayer}
                  value={scoreState.noPlayer}
                />
              </View>
              <View style={{ ...styles.containerScore, flexDirection: 'row' }}>
                <ButtonInfo title={'Jugar en parejas'} showModalInfo={handleShowModalInfo} colorIcon={colors.primary} />
                <Text style={{ fontSize: 20, color: colors.black }}>Jugar en parejas</Text>
                <Switch
                  trackColor={{ false: '#767577', true: colors.primary }}
                  thumbColor={scoreState.playCouples ? colors.white : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  style={{ position: 'absolute', right: 30 }}
                  onValueChange={handlePlayCouples}
                  value={scoreState.playCouples}
                />
              </View>
            </>
          }
        </ScrollView>
      </View>
      <View style={{ position: 'absolute', bottom: 10 }}>
        <ButtonPrincipal action={handleForm} disabled={numberPlayers === 0 || numberTotal === 0} text={'Siguiente'} />
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    height: '100%'
  },
  containerScore: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.2,
    width: '95%',
    paddingVertical: 20,
    borderColor: colors.primary,
    borderRadius: 10,
    flexDirection: 'row'
  },
})