import { StyleSheet, View, FlatList, Text, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import ItemPlayer from '../Player/components/ItemPlayer';
import ButtonPrincipal from '../commons/Buttons/ButtonPrincipal';
import { addTotalPoints, changeWhiteBlank, editPlayerPoints, onChangeEmptyPlayer, onChangePointsRound, removeTotalPoints } from '../../state/features/score/reducers';
import Trophy from '../lotties/Trophy';
import ModalEmpty from './components/ModalEmpty';
import { colors } from '../../utils/constants';

var Sound = require('react-native-sound');
Sound.setCategory('Playback');

const Round = ({ navigation }) => {
    const scoreState = useSelector(state => state.score);
    const dispatch = useDispatch();
    const [countdown, setCountdown] = useState(6);
    const [isCounting, setIsCounting] = useState(false);
    const [focusPlayerWin, setFocusPlayerWin] = useState({})
    const [focusIndex, setFocusIndex] = useState('')
    const [isVisibleModalEmpty, setIsVisibleModalEmpty] = useState(false)
    const [randomNumber, setRandomNumber] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showRounds, setShowRounds] = useState([])
    //function
    const handleSaveRound = () => {
        let playerWin = scoreState.playersPlay.find(player => player.victoryPlace === 1);
        if (playerWin && scoreState.winner === 0) {
            setFocusPlayerWin(playerWin)
            setIsCounting(true);
            const play = (error, sound) => sound.play()
            const sound = new Sound(
                require('../../assets/sounds/winner.mp3'),
                (error) => play(error, sound),
            )
        } else {
            navigation.navigate('Score')
        }
        dispatch(editPlayerPoints())
    }
    const handleChangePoints = (index, newValue) => {
        dispatch(onChangePointsRound({ index: index, newValue: newValue }))
    }
    const handleActiveWhite = (index) => {
        if (scoreState.randomEmpty && !scoreState.playersPlay[index].whiteActive) {
            setFocusIndex(index)
            handleAMenuActiveMenu(index)
        } else {
            dispatch(changeWhiteBlank({ index: index }))
        }
    }
    const handleAddTotalPoints = (index) => {
        dispatch(addTotalPoints({ index: index }))
    }
    const handleRemoveTotalPoints = (index) => {
        dispatch(removeTotalPoints({ index: index }))
    }
    const handleSetModalEmpty = () => {
        setIsGenerating(true)
        setIsVisibleModalEmpty(true)
    }
    const handleCloseModal = () => {
        dispatch(onChangeEmptyPlayer({ index: focusIndex, numberEmpty: randomNumber }))
        dispatch(changeWhiteBlank({ index: focusIndex }))
        setIsVisibleModalEmpty(false)
    }
    const handleShowRounds = (index) => {
        if (showRounds.includes(index)) {
            setShowRounds(showRounds.filter(item => item !== index));
        } else {
            setShowRounds([...showRounds, index])
        }
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
        navigation.setOptions({
            title: `Ronda ${scoreState.round}`,
            headerShown: !isCounting,
        });
    }, [navigation]);
    useEffect(() => {
        let intervalId;
        if (isCounting) {
            intervalId = setInterval(() => {
                setCountdown(countdown => countdown - 1);
            }, 1000);
        }

        if (countdown === 0) {
            navigation.navigate('Score')
            setIsCounting(false);
        }

        return () => clearInterval(intervalId);
    }, [isCounting, countdown]);
    //component

    const _renderItem = ({ item, index }) =>
    (
        <ItemPlayer
            points={((item.pointsRound + item.points) - (item.whiteActive ? item.numberEmpty : 0)) > scoreState.numberTotal ? scoreState.numberTotal : ((item.pointsRound + item.points) - (item.whiteActive ? item.numberEmpty : 0))}
            handleChangePoints={handleChangePoints}
            handleActiveWhite={handleActiveWhite}
            handleAddTotalPoints={handleAddTotalPoints}
            handleRemoveTotalPoints={handleRemoveTotalPoints}
            handleShowRounds={handleShowRounds}
            showRounds={showRounds}
            round
            scoreTotal={scoreState.numberTotal}
            disabled
            item={item}
            index={index} />
    )
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={isCounting ? { ...styles.root, justifyContent: 'center' } : styles.root}>
            <ModalEmpty isGenerating={isGenerating} randomNumber={randomNumber} isVisible={isVisibleModalEmpty} setModalVisible={handleCloseModal} />
            {
                isCounting ?
                    <View>
                        <Trophy width={350} height={350} />
                        <Text style={styles.winnerText}>{`¡Felicidades`}</Text>
                        <Text style={styles.winnerText}>{focusPlayerWin.name}</Text>
                        <Text style={styles.winnerText}>{`Ganaste!`}</Text>
                    </View>
                    :

                    <>
                        <FlatList
                            contentContainerStyle={{ paddingBottom: 70 }}
                            style={{ width: '100%', paddingHorizontal: 30 }}
                            data={scoreState.playersPlay}
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
        fontWeight: 'bold',
        color: colors.black
    }
})