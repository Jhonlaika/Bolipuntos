import { StyleSheet, View, Switch, Text } from 'react-native'
import React,{useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { colors } from '../../utils/constants'
import { addEmpty, addPlayer, addPlayersPlay, addTotal,onChangeEmpty, onChangePlayers, onChangeTotal, removeEmpty, removePlayer, removeTotal, setPlayCouples, setRandomEmpty } from '../../state/features/score/reducers';
import ButtonPrincipal from '../commons/Buttons/ButtonPrincipal';
import ItemScore from './components/ItemScore';
import ModalInformation from '../commons/Modal/ModalInformation';

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const scoreState = useSelector(state => state.score);
  const [showModalInfo,setShowModalInfo]=useState(false)
  const [focusTitle,setFocusTitle]=useState(false)
  const { numberPlayers, numberTotal, numberEmpty } = scoreState;

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
    dispatch(setPlayCouples(true))
  }
  const handleShowModalInfo =(title)=>{
    setFocusTitle(title)
    setShowModalInfo(!showModalInfo)
  }
  const handleTextModal=()=>{
    if(focusTitle ==='Cantidad de jugadores'){
      return 'Indica la cantidad de jugadores y asegúrate de contar con suficientes participantes. Para jugar en parejas se necesitan al menos 4 jugadores. Así podrás disfrutar del juego sin complicaciones desde el inicio.'
    }else if(focusTitle === 'Puntos a ganar'){
      return 'Escribe la cantidad de puntos necesarios para ganar la partida. Ten en cuenta que el puntaje elegido puede afectar la duración del juego, así que elige sabiamente. ¡Que empiece la diversión!'
    }else{
      return 'Escribe la cantidad de puntos a descontar si un jugador no hace puntos en una ronda. También puedes habilitar la opción para sortear estos puntos y que el limite sea los puntos escritos. Recuerda que esta elección puede impactar en el desarrollo del juego, ¡elige sabiamente y a disfrutar!.'
    }
  }
  return (
    <View style={styles.root}>
      <ModalInformation handleTextModal={handleTextModal} isVisible={showModalInfo} setModalVisible={handleShowModalInfo}/>
      <View style={styles.containerScore}>
        <ItemScore
          color={colors.black}
          colorIcon={colors.primary}
          showModalInfo={handleShowModalInfo}
          title={'Cantidad de jugadores'}
          actionAdd={handleAddPlayer}
          actionRemove={handleRemovePlayer}
          onChangeText={handleChangePlayers}
          value={numberPlayers}
        />
      </View>
      <View style={styles.containerScore}>
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
      <View style={styles.containerScore}>
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
        <View style={{ marginTop: 20, alignItems: 'center', width: '80%', justifyContent: 'space-between', flexDirection: 'row' }}>
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
      {
        scoreState.gameMode ==='roulette' &&
        <View style={{ marginTop: 30, alignItems: 'center', width: '75%', justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text style={{ fontSize: 20, color: colors.black }}>Jugar en parejas</Text>
        <Switch
          trackColor={{ false: '#767577', true: colors.primary }}
          thumbColor={scoreState.playCouples ? colors.white : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handlePlayCouples}
          value={scoreState.playCouples}
        />
      </View>
      }
      <View style={{ position: 'absolute', bottom: 10 }}>
        <ButtonPrincipal action={handleForm} disabled={numberPlayers === 0 || numberTotal === 0} text={'Siguiente'} />
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  root: {
    height: '100%',
    flex: 1,
    alignItems: 'center'
  },
  containerScore: {
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 0.2,
    width: '92%',
    paddingVertical: 20,
    borderColor: colors.primary,
    borderRadius: 10
  },
})