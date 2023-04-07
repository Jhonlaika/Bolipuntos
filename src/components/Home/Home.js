import { StyleSheet, View, Switch, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { colors } from '../../utils/constants'
import { addEmpty, addPlayer, addPlayersPlay, addTotal, getPlayers, getPlayersPlay, onChangeEmpty, onChangePlayers, onChangeTotal, removeEmpty, removePlayer, removeTotal, setConfig, setPlayCouples, setRandomEmpty } from '../../state/features/score/reducers';
import ButtonPrincipal from '../commons/Buttons/ButtonPrincipal';
import ItemScore from './components/ItemScore';
import { getData } from '../../utils/storage';

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const scoreState = useSelector(state => state.score);
  const { numberPlayers, numberTotal, numberEmpty } = scoreState;

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
        navigation.navigate('Score')
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
    dispatch(setPlayCouples())
  }
  return (
    <View style={styles.root}>

      <View style={styles.containerPlayers}>
        <ItemScore
          color={colors.white}
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
          title={'Descuento mayor blanco'}
          actionAdd={handleAddEmpty}
          actionRemove={handleRemoveEmpty}
          onChangeText={handleChangeEmpty}
          value={numberEmpty}
        />
        <View style={{ marginTop: 20, alignItems: 'center', width: '80%', justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text style={{ fontSize: 20, color: colors.black }}>Sortear blanco</Text>
          <Switch
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={scoreState.randomEmpty ? colors.white : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleSetRandomEmpty}
            value={scoreState.randomEmpty}
          />
        </View>
      </View>
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
      <View style={{ position: 'absolute', bottom: 10 }}>
        <ButtonPrincipal action={handleForm} disabled={numberPlayers === 0 || numberTotal === 0 || numberEmpty === 0} text={'Siguiente'} />
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
    borderColor: colors.gray,
    borderRadius: 10
  },
  containerPlayers: {
    paddingTop: 25,
    height: '20%',
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.primary
  }
})