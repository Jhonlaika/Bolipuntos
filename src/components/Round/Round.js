import { StyleSheet, View, FlatList, Text, Alert, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import ItemPlayer from '../Player/components/ItemPlayer';
import ButtonPrincipal from '../commons/Buttons/ButtonPrincipal';
import { addTotalPoints, changeWhiteBlank, editPlayerPoints, onChangeEmptyPlayer, onChangePointsRound, removeTotalPoints, resetRoundsGame, scoreSlice, setVictoryPlayer } from '../../state/features/score/reducers';
import Trophy from '../lotties/Trophy';
import ModalEmpty from './components/ModalEmpty';
import { colors, deletionMessages, fontFamily } from '../../utils/constants';
import ModalRandomName from './components/ModalRandomName';
import Loser from '../lotties/Loser';

var Sound = require('react-native-sound');
Sound.setCategory('Playback');

const Round = ({ navigation }) => {
    const scoreState = useSelector(state => state.score);
    const dispatch = useDispatch();
    const [countdown, setCountdown] = useState(6);
    const [isCounting, setIsCounting] = useState(false);
    const [countdownLoser, setCountdownLoser] = useState(7);
    const [isCountingLoser, setIsCountingLoser] = useState(false);
    const [focusPlayerWin, setFocusPlayerWin] = useState({})
    const [focusPlayerLost, setFocusPlayerLost] = useState({})
    const [focusId, setFocusId] = useState('')
    const [isVisibleModalEmpty, setIsVisibleModalEmpty] = useState(false)
    const [isVisibleModalRandomName, setIsVisibleModalRandomName] = useState(false)
    const [randomNumber, setRandomNumber] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingName, setIsGeneratingName] = useState(false);
    const [randomName, setRandomName] = useState(null);
    const [showRounds, setShowRounds] = useState([])
    const [playersLosers, setPlayerLosers] = useState([])
    const [randomMessage, setRandomMessage] = useState('')
    //function
    const handleSaveRound = (winner = false) => {
        let playerWin = scoreState.playersPlay.find(player => player.victoryPlace === 1);
        let playerLose = {};
        if (data.some((player) => player.pointsRound === "" && !player.whiteActive && !player.victory && !winner)) {
            return alert('Debe ingresar los puntos de la ronda')
        }
        if (playerWin && scoreState.winner === 0) {
            setFocusPlayerWin(playerWin)
            setIsCounting(true);
            if(!winner){
                dispatch(setVictoryPlayer({ id: playerWin.id, changePlace: false }))
            }
            const play = (error, sound) => sound.play()
            const sound = new Sound(
                require('../../../assets/sounds/winner.mp3'),
                (error) => play(error, sound),
            )
        } else if (scoreState.gameMode === 'roulette'
            && (scoreState.activeNumberPlayerWinRandom ? scoreState.playersPlay.filter(player => player.victoryPlace > 0).length <= scoreState.numberPlayerWinRandom : true)
            && scoreState.playersPlay.filter(player => !player.victoryPlace > 0).length > (scoreState.playCouples ? 2 : 1)
            && data.find(player => player.victoryPlace > 0)) {
            handleSetModalRandomName()
        } else if (scoreState.gameMode === 'eliminated') {

            let minScore = Infinity;
            let minPlayers = [];

            scoreState.playersPlay.filter((player)=> !player.eliminated).forEach(player => {
                const totalScore = player.points + (player.pointsRound ? player.pointsRound : 0);
                if (totalScore < minScore) {
                    minScore = totalScore;
                    minPlayers = [player];
                } else if (totalScore === minScore) {
                    minPlayers.push(player);
                }
            });
            dispatch(editPlayerPoints())
            if (scoreState.round === scoreState.numberRoundsEliminated) {
                setRandomMessage(deletionMessages[Math.floor(Math.random() * deletionMessages.length)])
                if (minPlayers.length === 1) {
                    setIsCountingLoser(true)
                    setFocusPlayerLost(minPlayers[0])
                    dispatch(resetRoundsGame(minPlayers[0].id))
                } else {
                    setPlayerLosers(minPlayers)
                    handleSetModalRandomName()
                }
            } else {
                navigation.navigate('Score')
            }
        }
        else {
            navigation.navigate('Score')
            dispatch(editPlayerPoints())
        }
    }
    const handleGetDataUsers = () => {
        if (scoreState.gameMode === 'eliminated') {
            return scoreState.playersPlay.filter(player => !player.eliminated)
        } else {
            return scoreState.playCouples ? scoreState.playersPlay.filter((item, index) => (scoreState.round % 2 === 0 ? index % 2 !== 0 : index % 2 === 0) && !item.victory) : scoreState.playersPlay.filter(player => !player.victory)
        }
    }
    const data = handleGetDataUsers();

    const handleChangePoints = (id, newValue) => {
        dispatch(onChangePointsRound({ id: id, newValue: newValue }))
    }
    const handleActiveWhite = (id) => {
        if (scoreState.randomEmpty && !scoreState.playersPlay.find(player => player.id === id).whiteActive) {
            setFocusId(id)
            handleAMenuActiveMenu()
        } else {
            dispatch(changeWhiteBlank({ id: id }))
        }
    }
    const handleAddTotalPoints = (index) => {
        let newIndex = scoreState.round % 2 === 0 ? (index + (index + 1)) : (index + index);
        index = scoreState.playCouples ? newIndex : index;
        dispatch(addTotalPoints({ index: index }))
    }
    const handleRemoveTotalPoints = (index) => {
        let newIndex = scoreState.round % 2 === 0 ? (index + (index + 1)) : (index + index);
        index = scoreState.playCouples ? newIndex : index;
        dispatch(removeTotalPoints({ index: index }))
    }
    const handleSetModalEmpty = () => {
        setIsGenerating(true)
        setIsVisibleModalEmpty(true)
    }
    const handleSetModalRandomName = () => {
        setIsVisibleModalRandomName(true)
    }

    const handleCloseModalRandomName = () => {
        if (scoreState.gameMode === 'eliminated') {
            setIsCountingLoser(true)
            setFocusPlayerLost(randomName)
            dispatch(resetRoundsGame(randomName.id))
            setIsVisibleModalRandomName(false)
            setRandomName(null)
        } else {
            dispatch(setVictoryPlayer({ id: randomName?.id ? randomName?.id : 0, changePlace: true }))
            setIsVisibleModalRandomName(false)
            setRandomName(null)
        }
    }
    const handleRandomName = () => {
        setIsGeneratingName(true)
    }
    const handleCloseModal = () => {
        dispatch(onChangeEmptyPlayer({ id: focusId, numberEmpty: randomNumber }))
        dispatch(changeWhiteBlank({ id: focusId }))
        setIsVisibleModalEmpty(false)
    }
    const handleShowRounds = (id) => {
        if (showRounds.includes(id)) {
            setShowRounds(showRounds.filter(item => item !== id));
        } else {
            setShowRounds([...showRounds, id])
        }
    }
    const handleSetRemaining = (item) => {
        let remaining = 0;
        if (scoreState.playCouples) {
            let player = scoreState.playersPlay.find((player) => player.id === item.id);
            if (player) {
                const pair = player.pair; // Obtener el valor de pair del elemento encontrado
                const totalPoints = scoreState.playersPlay.filter(player => player.pair === pair) // Filtrar los elementos con el mismo valor de pair
                    .reduce((total, player) => total + player.points, 0);
                remaining = (item.whiteActive ? (scoreState.numberTotal + item.numberEmpty) : scoreState.numberTotal) - (item.pointsRound ? ((isNaN(item.pointsRound) ? 0 : item.pointsRound) + totalPoints) : totalPoints);
                return remaining < 0 ? 0 : remaining
            }
        } else {
            remaining = (item.whiteActive ? (scoreState.numberTotal + item.numberEmpty) : scoreState.numberTotal) - (item.pointsRound ? ((isNaN(item.pointsRound) ? 0 : item.pointsRound) + item.points) : item.points);
            return remaining < 0 ? 0 : remaining
        }
    }
    const handleEndGame = () => {
        navigation.navigate('Score', { endGame: true })
    }
    const handleResetGame = () => {
        navigation.navigate('Score', { resetGame: true })
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
                    onPress: () => handleEndGame(),
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
                    onPress: () => handleResetGame(),
                },
            ]
        );
    }
    const handleAMenuActiveMenu = () => {
        Alert.alert(
            'Sortear blanco',
            'Estás seguro de que deseas sortear el blanco?',
            [
                { text: "Cancelar", style: 'cancel', onPress: () => { } },
                {
                    text: 'Aceptar',
                    style: 'destructive',
                    onPress: () => handleSetModalEmpty(),
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

                return (((isNaN(item.pointsRound) ? 0 : item.pointsRound) + totalPoints) - (item.whiteActive ? item.numberEmpty : 0)) > scoreState.numberTotal ? scoreState.numberTotal : (((isNaN(item.pointsRound) ? 0 : item.pointsRound) + totalPoints) - (item.whiteActive ? item.numberEmpty : 0))
            }
        } else {
            return (((isNaN(item.pointsRound) ? 0 : item.pointsRound) + item.points) - (item.whiteActive ? item.numberEmpty : 0)) > scoreState.numberTotal ? scoreState.numberTotal : (((isNaN(item.pointsRound) ? 0 : item.pointsRound) + item.points) - (item.whiteActive ? item.numberEmpty : 0))
        }
    }
    const handleWinPlayer = (id) => {
        handleSaveRound(true)
        dispatch(setVictoryPlayer({ id: id, changePlace: false }))
    }
    const handleOnEndEditing = (item) => {
        let playerFind = scoreState.playersPlay.find(player => player.id === item)
        if (playerFind.victoryPlace === 1 || (playerFind.victoryPlace > 0 && scoreState.gameMode === 'roulette') && (scoreState.activeNumberPlayerWinRandom ? scoreState.playersPlay.filter(player => player.victoryPlace > 0).length <= scoreState.numberPlayerWinRandom : true)) {
            Alert.alert(
                'Jugador gano',
                `${playerFind.name} ha completado este puntaje? `,
                [
                    { text: "No", style: 'cancel', onPress: () => { handleChangePoints(playerFind.id, 0) } },
                    {
                        text: 'Si',
                        style: 'destructive',
                        onPress: () => handleWinPlayer(playerFind.id),
                    },
                ]
            );
        }
    }
    const handleEligibleNames = () => {
        if (scoreState.gameMode === 'eliminated') {
            return playersLosers
        } else {
            let eligibleNames = scoreState.playersPlay.filter(player => !player.victoryPlace > 0);
            return scoreState.noPlayer ? [...eligibleNames, { id: 0, name: 'Ninguno' }] : eligibleNames;
        }
    }
    //useEffects
    useEffect(() => {
        let intervalId;
        let timeoutId;
        if (isGenerating) {
            intervalId = setInterval(() => {
                const newRandomNumber = Math.floor(Math.random() * (scoreState.numberEmpty / 5)) * 5 + 5;
                setRandomNumber(newRandomNumber);
            }, 100);

            timeoutId = setTimeout(() => {
                clearInterval(intervalId);
                setIsGenerating(false);
            }, 5000);
        }
        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [isGenerating]);
    useEffect(() => {
        let intervalId;
        let timeoutId;
        let eligibleNames = handleEligibleNames();
        if (isGeneratingName) {
            intervalId = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * eligibleNames.length);
                setRandomName(eligibleNames[randomIndex]);
            }, 100);

            timeoutId = setTimeout(() => {
                clearInterval(intervalId);
                setIsGeneratingName(false);
            }, 7000);
        }
        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [isGeneratingName, scoreState.playersPlay]);
    useEffect(() => {
        navigation.setOptions({
            title: `Ronda ${scoreState.round}`,
            headerShown: !(isCounting || isCountingLoser),
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
    }, [navigation, isCounting, isCountingLoser]);
    // loottie Winner
    useEffect(() => {
        let intervalId;
        if (isCounting) {
            intervalId = setInterval(() => {
                setCountdown(countdown => countdown - 1);
            }, 1000);
        }

        if (countdown === 0) {
            if (scoreState.gameMode === 'roulette') {
                handleSetModalRandomName()
            }
            setIsCounting(false);
        }

        return () => clearInterval(intervalId);
    }, [isCounting, countdown]);
    // loottie loser
    useEffect(() => {
        let intervalId;
        if (isCountingLoser) {
            intervalId = setInterval(() => {
                setCountdownLoser(countdown => countdown - 1);
            }, 1000);
        }

        if (countdownLoser === 0) {
            navigation.navigate('Score')
            setIsCountingLoser(false);
        }

        return () => clearInterval(intervalId);
    }, [isCountingLoser, countdownLoser]);
    //component

    const _renderItem = ({ item, index }) =>
    (
        <ItemPlayer
            points={handleSetPoints(item)}
            handleOnEndEditing={handleOnEndEditing}
            handleChangePoints={handleChangePoints}
            handleActiveWhite={handleActiveWhite}
            handleAddTotalPoints={handleAddTotalPoints}
            handleRemoveTotalPoints={handleRemoveTotalPoints}
            handleShowRounds={handleShowRounds}
            showRounds={showRounds}
            remaining={handleSetRemaining(item)}
            round
            scoreTotal={scoreState.numberTotal}
            disabled
            item={item}
            gameMode={scoreState.gameMode}
            index={index} />
    )
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={(isCounting || isCountingLoser) ? { ...styles.root, justifyContent: 'center' } : styles.root}>
            {isVisibleModalRandomName && <ModalRandomName gameMode={scoreState.gameMode} playersPlay={scoreState.playersPlay} playCouples={scoreState.playCouples} handleRandomName={handleRandomName} isGenerating={isGeneratingName} randomName={randomName} isVisible={isVisibleModalRandomName} setModalVisible={handleCloseModalRandomName} />}
            <ModalEmpty isGenerating={isGenerating} randomNumber={randomNumber} isVisible={isVisibleModalEmpty} setModalVisible={handleCloseModal} />
            {
                isCounting || isCountingLoser ?
                    <View>
                        {
                            isCounting
                            &&
                            <Trophy width={350} height={350} />
                        }
                        {
                            isCountingLoser
                            &&
                            <View style={{ marginVertical: 15, alignSelf: 'center' }}>
                                <Loser width={200} height={200} />
                            </View>
                        }
                        <Text style={styles.winnerText}>{scoreState.gameMode ==='eliminated' ? `Perdiste` :'¡Felicidades'}</Text>
                        {
                            scoreState.playCouples &&
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                                {
                                    scoreState.playersPlay.filter((player) => player.victoryPlace === 1).map((player, index) => (
                                        <Text index={index} style={{ ...styles.winnerText, alignSelf: 'center' }}>{`${player.name}${index === 0 ? ' y ' : ''}`}</Text>
                                    ))
                                }
                            </View>
                        }
                        {
                            !scoreState.playCouples &&
                            <Text style={isCounting ? styles.winnerText : { ...styles.winnerText, marginVertical: 15, fontFamily: fontFamily.fontFamilyBlack }}>{isCounting ? focusPlayerWin.name : focusPlayerLost.name}</Text>
                        }
                        <Text style={styles.winnerText}>{isCounting ? `Ganaste!` : randomMessage}</Text>
                    </View>
                    :

                    <>
                        <FlatList
                            contentContainerStyle={{ paddingBottom: 70 }}
                            style={{ width: '100%', paddingHorizontal: 30 }}
                            data={data}
                            renderItem={_renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <View style={{ position: 'absolute', bottom: 10 }}>
                            <ButtonPrincipal action={handleSaveRound} text={'Guardar Ronda'} />
                        </View>
                    </>
            }

        </KeyboardAvoidingView>
    )
}

export default Round

const styles = StyleSheet.create({
    root: {
        height: '100%',
        width: '100%',
        flex: 1,
        alignItems: 'center',
        paddingBottom: 70
    },
    winnerText: {
        fontSize: 25,
        alignSelf: 'center',
        fontFamily: fontFamily.fontFamilyBold,
        color: colors.black,
        textAlign: 'center',
        marginHorizontal: 20
    }
})