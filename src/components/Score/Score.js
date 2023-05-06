import { StyleSheet, View, FlatList, Text, BackHandler, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import ItemPlayer from '../Player/components/ItemPlayer';
import ButtonPrincipal from '../commons/Buttons/ButtonPrincipal';
import { colors, stateInitial } from '../../utils/constants';
import { removeValue, storeData } from '../../utils/storage';
import { getPlayersPlay, randomPlayerStart, restartGame, setConfig } from '../../state/features/score/reducers';
import Spin from '../lotties/Spin';
var Sound = require('react-native-sound');
Sound.setCategory('Playback');

const Score = ({ navigation, route }) => {
    const scoreState = useSelector(state => state.score);
    const dispatch = useDispatch();
    const [isCounting, setIsCounting] = useState(false);
    const [countdown, setCountdown] = useState(6);
    const endGame = route.params?.endGame;
    const resetGame = route.params?.resetGame;
    //function
    const handleNextRound = () => {
        navigation.navigate('Round')

    }
    const handleFinishGame = () => {
        navigation.navigate('InitView', { finishGame: true })
        dispatch(setConfig({
            ...stateInitial
        }))
        storeData({
            ...stateInitial
        }, '@config')
        dispatch(getPlayersPlay([]))
        removeValue('@playersPlay')
    }
    const handleRestartGame = (random) => {
        if (random) {
            dispatch(restartGame())
            dispatch(randomPlayerStart())
            setIsCounting(true);
            const play = (error, sound) => sound.play()
            const sound = new Sound(
                require('../../../assets/sounds/spin.mp3'),
                (error) => play(error, sound),
            )
        } else {
            dispatch(restartGame())
        }
    }
    const backAction = () => {
        handleMenuFinishGame()
        return true
    }
    const handleMenuFinishGame = () => {
        Alert.alert(
            'Terminar juego',
            'Estás seguro de que deseas terminar el juego?',
            [
                { text: "Cancelar", style: 'cancel', onPress: () => { } },
                {
                    text: 'Aceptar',
                    style: 'destructive',
                    onPress: () => handleFinishGame(),
                },
            ]
        );
    }
    const handleMenuRestartGame = () => {
        Alert.alert(
            'Reiniciar juego',
            'Estás seguro de que deseas reiniciar el juego?',
            [
                { text: "Cancelar", style: 'cancel', onPress: () => { } },
                {
                    text: 'Aceptar',
                    style: 'destructive',
                    onPress: () => handleMenuRandomGame(),
                },
            ]
        );
    }
    const handleMenuRandomGame = () => {
        Alert.alert(
            'Sortear juego',
            'Deseas sortear el juego?',
            [
                { text: "Cancelar", style: 'cancel', onPress: () => { handleRestartGame(false) } },
                {
                    text: 'Aceptar',
                    style: 'destructive',
                    onPress: () => handleRestartGame(true),
                },
            ]
        );
    }
    const handleSetPoints = (item) => {
        if (scoreState.playCouples) {
            let player = scoreState.playersPlay.find((player) => player.id === item.id);
            if (player) {
                const pair = player.pair; // Obtener el valor de pair del elemento encontrado
                const totalPoints = scoreState.playersPlay.filter(player => player.pair === pair) // Filtrar los elementos con el mismo valor de pair
                    .reduce((total, player) => total + player.points, 0);

                return totalPoints
            }
        } else {
            return item.points
        }
    }
    const handleSetRemaining = (item) => {
        if (scoreState.playCouples) {
            let player = scoreState.playersPlay.find((player) => player.id === item.id);
            if (player) {
                const pair = player.pair; // Obtener el valor de pair del elemento encontrado
                const totalPoints = scoreState.playersPlay.filter(player => player.pair === pair) // Filtrar los elementos con el mismo valor de pair
                    .reduce((total, player) => total + player.points, 0);

                return scoreState.numberTotal - totalPoints;
            }
        } else {
            return scoreState.numberTotal - item.points;
        }
    }
    const handleGetDataUsers=()=>{
        if(scoreState.gameMode === 'eliminated'){
           return scoreState.playersPlay.filter(player => !player.eliminated)  
        }else{
            return scoreState.playersPlay
        }
    }
    const data = handleGetDataUsers();


    //useEffects
    useEffect(() => {
        endGame && handleFinishGame()
        resetGame && handleMenuRandomGame()
      }, [endGame,resetGame])
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        let intervalId;
        if (isCounting) {
            intervalId = setInterval(() => {
                setCountdown(countdown => countdown - 1);
            }, 1000);
        }

        if (countdown === 0) {
            setIsCounting(false);
            setCountdown(6)
        }

        return () => clearInterval(intervalId);
    }, [isCounting, countdown]);

    useEffect(() => {
        navigation.setOptions({
            headerShown: !isCounting,
            headerLeft: () => (
                <TouchableOpacity style={{ paddingVertical: 10 }} onPress={handleMenuFinishGame}>
                    <Text style={{ color: colors.white }}>Terminar juego</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity style={{ paddingVertical: 10 }} onPress={handleMenuRestartGame}>
                    <Text style={{ color: colors.white }}>Reiniciar juego</Text>
                </TouchableOpacity>
            )
        });
    }, [navigation, isCounting]);
    //components
    const _renderItem = ({ item, index }) =>
    (
        <ItemPlayer
            lengthPlayers={scoreState.playersPlay.length}
            totalPoints={handleSetPoints(item)}
            remaining={handleSetRemaining(item)}
            points={item.points}
            score
            disabled
            playCouples={scoreState.playCouples}
            victoryPlace={item.victoryPlace}
            item={item}
            gameMode={scoreState.gameMode}
            scoreTotal={scoreState.numberTotal}
            index={index} />
    )
    return (
        <View style={isCounting ? { ...styles.root, justifyContent: 'center' } : styles.root}>
            {
                isCounting ?
                    <Spin width={350} height={350} />
                    :
                    <>
                        <Text style={styles.title}>{scoreState.gameMode === 'eliminated' ? 'Rondas por jugar: ': 'Puntuación a ganar: '}<Text>{scoreState.gameMode === 'eliminated' ? (scoreState.numberRoundsEliminated - (scoreState.round -1)) :scoreState.numberTotal}</Text></Text>
                        <FlatList
                            contentContainerStyle={{ paddingBottom: 50, alignItems: 'center' }}
                            numColumns={2}
                            data={data}
                            renderItem={_renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <View style={{ position: 'absolute', bottom: 10 }}>
                            <ButtonPrincipal action={handleNextRound} text={'Siguiente Ronda'} />
                        </View>
                    </>
            }
        </View>
    )
}

export default Score

const styles = StyleSheet.create({
    root: {
        height: '100%',
        width: '100%',
        flex: 1,
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 60
    },
    title: {
        fontSize: 20,
        marginVertical: 10,
        fontWeight: '500',
        color: colors.black
    }
})