import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { colors } from '../../../utils/constants'
import ItemScore from '../../Home/components/ItemScore';

const ItemPlayer = ({ index,showRounds,handleShowRounds,lengthPlayers, handleAddTotalPoints, handleRemoveTotalPoints, score, handleActiveWhite, handleChangePoints, action, round, item, disabled, scoreTotal, points = 0 }) => {
  const setPoints = (value) => {
    handleChangePoints(index, value)
  }

  return (
    <View>
      {
        score && item.victoryPlace === 1 &&
        <Image resizeMode='contain' style={{ width: 70, height: 70, bottom: 0, right: 0, position: 'absolute', zIndex: 1, opacity: 1 }} source={require('../../../assets/images/winner.png')} />
      }
      <View style={score ? {
        ...styles.root,
        borderRadius: 10,
        borderWidth: 0.2,
        padding: 20,
        marginVertical: 7,
        marginHorizontal: 7,
        borderColor: item?.backgroundColor ? item.backgroundColor : colors.primary
      } : styles.root}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={item?.backgroundColor ? { ...styles.circle, backgroundColor: item?.backgroundColor ? item.backgroundColor : colors.primary } : styles.circle}>
            <Text style={styles.textInitial}>{(round || score) ? ((item.victoryPlace >= 1 && item.victory) ? 'Gano' : points) : (item ? item.name[0].toUpperCase() : 'J')}</Text>
          </View>
          <TouchableOpacity disabled={disabled} onPress={() => action(index)} style={!score && { width: (round || score) ? '30%' : '100%' }}>
            <Text style={{ ...styles.text, color: item?.backgroundColor ? item.backgroundColor : colors.gray }}>{item ? item.name : `Jugador ${index + 1}`}</Text>
          </TouchableOpacity>
          {
            round &&
            <View style={{ width: '45%', paddingBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ width: '50%' }}>
                <ItemScore
                  value={String(item.pointsRound)}
                  editableInput={item.whiteActive || (item.victoryPlace >= 1 && item.victory)}
                  actionAdd={handleAddTotalPoints}
                  index={index}
                  actionRemove={handleRemoveTotalPoints}
                  onChangeText={setPoints}
                  color={item?.backgroundColor ? item.backgroundColor : colors.primary} />
              </View>
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <TouchableOpacity disabled={(item.victoryPlace >= 1 && item.victory)} onPress={() => handleActiveWhite(index)} style={{ ...styles.select, backgroundColor: item.whiteActive ? item?.backgroundColor ? item.backgroundColor : colors.primary : colors.white }} />
                <Text style={{ color: colors.black }}>blanco</Text>
              </View>
            </View>
          }
        </View>
        {
          score &&
          <View style={{ marginTop: 10, height: 70, justifyContent: 'space-between' }}>
            <Text style={styles.subTitlePoints}>{`Restante: ${scoreTotal - item.points}`}</Text>
            <Text style={styles.subTitlePoints}>{`Blancos: ${item.numberWhites}`}</Text>
            <Text style={{ ...styles.subTitlePoints }}>Posicion: <Text style={{ fontWeight: 'bold' }}>{`${item.victoryPlace === 0 ? (item.place === lengthPlayers ? 'Marrano' : item.place) : item.victoryPlace}`}</Text></Text>
          </View>
        }
        {round &&
          <View>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={{ ...styles.textRemaining, color: item.backgroundColor }}>{`Restante: ${scoreTotal - (item.pointsRound ? (item.pointsRound + item.points) : item.points)}`}</Text>
              <TouchableOpacity onPress={()=>handleShowRounds(index)}>
                <Text style={{ ...styles.textRemaining, color: item.backgroundColor }}>Ver rondas</Text>
              </TouchableOpacity>
            </View>
            {
            showRounds.includes(index) &&                 
             <View  style={{marginVertical:10,flexWrap:'wrap',flexDirection:'row'}}>
             { item.rounds.map((round,index)=>(
                <Text style={{ ...styles.textRemaining,marginTop:5,width:'50%'}}>{`Ronda ${index+1}: ${round ?round:0}`}</Text>
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
    </View>
  )
}

export default ItemPlayer

const styles = StyleSheet.create({
  root: {
    marginVertical: 5,
  },
  textRemaining: {
    fontWeight: 'bold',
    color:colors.black
  },
  select: {
    borderWidth: 0.5,
    width: 30,
    height: 30,
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
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  text: {
    color: colors.gray,
    fontSize: 20,
    paddingVertical: 10
  }

})