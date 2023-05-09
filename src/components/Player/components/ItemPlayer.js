import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { colors } from '../../../utils/constants'
import ItemScore from '../../Home/components/ItemScore';

const ItemPlayer = ({
  playCouples,
  index,
  showRounds,
  handleShowRounds,
  lengthPlayers, 
  handleAddTotalPoints, 
  handleRemoveTotalPoints, 
  score, handleActiveWhite, 
  handleChangePoints, 
  action, 
  round, 
  item, 
  disabled, 
  points = 0, 
  totalPoints,
  remaining,
  scoreTotal,
  handleOnEndEditing,
  gameMode
}) => {
  const setPoints = (value) => {
    handleChangePoints(item.id, value)
  }
  const setOnEndEditing=()=>{
    handleOnEndEditing(item.id)
  }
  return (
    <View>
      {
        playCouples && !round &&
        <Text style={{ fontSize: 20, color: index % 2 == 0 ? colors.black : colors.white, fontWeight: 'bold', marginVertical: (score || index % 2 === 0) ? 10 : 0 }}>{`Pareja ${(index / 2) + 1}`}</Text>
      }
      {
        score && item.victoryPlace === 1 &&
        <Image resizeMode='contain' style={playCouples?{...styles.imageWinner,top:40}:{...styles.imageWinner,bottom:0}} source={require('../../../../assets/images/winner.png')} />
      }
      <View style={score ? {
        ...styles.root,
        borderRadius: 10,
        borderWidth: 0.2,
        padding: 20,
        marginVertical: 7,
        marginHorizontal: 5,
        borderColor: item?.backgroundColor ? item.backgroundColor : colors.primary
      } : styles.root}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={item?.backgroundColor ? { ...styles.circle, backgroundColor: item?.backgroundColor ? item.backgroundColor : colors.primary } : styles.circle}>
            <Text style={styles.textInitial}>{(round || score) ? ((item.victoryPlace >= 1 && item.victory) ? 'Gano' : points) : (item?.name ? item.name[0].toUpperCase() : 'J')}</Text>
          </View>
          <TouchableOpacity disabled={disabled} onPress={() => action(index)} style={!score && { width: round ? '30%' : '100%' }}>
            <Text numberOfLines={1} style={{ ...styles.text,width:score && 58,fontSize:(item?.name && (score)) ?100/item.name.length:20,color: item?.backgroundColor ? item.backgroundColor : colors.gray }}>{item?.name ? item.name : `Jugador ${index + 1}`}</Text>
          </TouchableOpacity>
          {
            round &&
            <View style={{ width: '45%', paddingBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ width: '60%' }}>
                <ItemScore
                  visibleOperator
                  info={false}
                  value={String(item.pointsRound)}
                  editableInput={item.whiteActive || (item.victoryPlace >= 1 && item.victory)}
                  actionAdd={handleAddTotalPoints}
                  index={index}
                  onEndEditing={setOnEndEditing}
                  actionRemove={handleRemoveTotalPoints}
                  onChangeText={setPoints}
                  whiteActive={item.whiteActive}
                  color={item?.backgroundColor ? item.backgroundColor : colors.primary} />
              </View>
              <View style={{ alignItems: 'center', marginTop: 5 }}>
                <TouchableOpacity disabled={(item.victoryPlace >= 1 && item.victory)} onPress={() => handleActiveWhite(item.id)} style={{ ...styles.select, backgroundColor: item.whiteActive ? item?.backgroundColor ? item.backgroundColor : colors.primary : colors.white }} />
                <Text style={{ color: colors.black }}>blanco</Text>
              </View>
            </View>
          }
        </View>
        {
          score &&
          <View style={{ marginTop: 10, height: !playCouples ? 70 : 25, justifyContent: gameMode !=='eliminated' ? 'space-between' :'space-around'}}>
            {
              (!playCouples && gameMode !=='eliminated') &&
              <Text style={styles.subTitlePoints}>{`Restante: ${remaining <0 ?0:remaining}`}</Text>
            }
            <Text style={styles.subTitlePoints}>{`Blancos: ${item.numberWhites}`}</Text>
            {
              !playCouples &&
              <Text style={{ ...styles.subTitlePoints }}>Posicion: <Text style={{ fontWeight: 'bold' }}>{`${item.victoryPlace === 0 ? (item.place === lengthPlayers ? '🐷' : item.place) : item.victoryPlace}`}</Text></Text>

            }
          </View>
        }
        {round &&
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {gameMode !=='eliminated' &&              
              <Text style={{ ...styles.textRemaining, color: item.backgroundColor }}>{`Restante: ${remaining <0 ? 0 : remaining}`}</Text>
              }
              <TouchableOpacity onPress={() => handleShowRounds(item.id)}>
                <Text style={{ ...styles.textRemaining, color: item.backgroundColor }}>Ver rondas</Text>
              </TouchableOpacity>
            </View>
            {
              showRounds.includes(item.id) &&
              <View style={{ marginVertical: 10, flexWrap: 'wrap', flexDirection: 'row' }}>
                {item.rounds.map((round, index) => (
                  <Text index={index} style={{ ...styles.textRemaining, marginTop: 5, width: '50%' }}>{`Ronda ${index + 1}: ${round ? round : 0}`}</Text>
                ))}
              </View>
            }
          </View>
        }
        {
          !score &&
          <View style={styles.divider} />
        }

      </View>
      {
        (score && playCouples) &&
        <View style={{ ...styles.pairsContainer,marginTop:(gameMode ==='eliminated' && index % 2 !== 0) ? 10 :0,borderWidth: 0.2, borderColor: item.backgroundColor }}>
          {
            index % 2 === 0
              ?
              <>
                <Text style={{ ...styles.subTitlePoints, fontSize: 20, color: item.backgroundColor, fontWeight: 'bold' }}>{`Total Pareja`}</Text>
                <Text style={{ ...styles.subTitlePoints, fontSize: 20, color: item.backgroundColor, fontWeight: 'bold' }}>{totalPoints > scoreTotal ? scoreTotal:totalPoints}</Text>

              </>
              :
              <>
                {
                  gameMode !=='eliminated' &&
                  <Text style={{ ...styles.subTitlePoints, color: item.backgroundColor,paddingTop:3.5 }}>{`Restante : ${remaining <0 ?0:remaining}`}</Text>
                }
                <Text style={{ ...styles.subTitlePoints,paddingBottom:3.5 }}>Posicion: <Text style={{ fontWeight: 'bold' }}>{`${item.victoryPlace === 0 ? (item.place === (playCouples ? lengthPlayers/2:lengthPlayers) ? '🐷' : item.place) : item.victoryPlace}`}</Text></Text>
              </>
          }
        </View>
      }
    </View>
  )
}

export default ItemPlayer

const styles = StyleSheet.create({
  root: {
    marginVertical: 5,
  },
  pairsContainer: {
    marginHorizontal: 5,
    padding: 20,
    borderRadius: 10,
  },
  textRemaining: {
    fontWeight: 'bold',
    color: colors.black
  },
  select: {
    borderWidth: 0.5,
    width: 35,
    height: 35,
    borderColor: colors.gray,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10
  },
  points: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary
  },
  subTitlePoints: {
    fontSize: 17,
    fontWeight: '300',
    color: colors.black
  },
  divider: {
    borderWidth: 0.5,
    borderColor: colors.gray,
    marginTop: 5
  },
  textInitial: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.white
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  text: {
    color: colors.gray,
    fontSize: 20,
    paddingVertical: 10
  },
  imageWinner:{ 
    width: 70, 
    height: 70, 
    right: 0, 
    position: 'absolute', 
    zIndex: 1, 
    opacity: 1 
  }

})