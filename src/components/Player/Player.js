import { StyleSheet, Text, View, FlatList, Switch, Keyboard } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import ButtonPrincipal from '../commons/Buttons/ButtonPrincipal'
import ItemPlayer from './components/ItemPlayer';
import ModalPlayer from './components/ModalPlayer';
import ModalAddPlayer from './components/ModalAddPlayer';
import { createPlayer, editPlayerPlay, onChangeNewPlayer, randomPlayerStart } from '../../state/features/score/reducers';
import { storeData } from '../../utils/storage';
import { colors, generateRandomColor } from '../../utils/constants';
import Spin from '../lotties/Spin';
var Sound = require('react-native-sound');
Sound.setCategory('Playback');


const Player = ({ navigation }) => {

    const dispatch = useDispatch();
    const scoreState = useSelector(state => state.score);
    const listPlayers = scoreState.players.filter((item) => {
        const exists = scoreState.playersPlay.some((el) => {
            return el && el.id === item.id;
        });
        return !exists;
    });
    const [isModalVisiblePlayer, setModalVisiblePlayer] = useState(false);
    const [isModalVisibleAddPlayer, setModalVisibleAddPlayer] = useState(false);
    const [pressButtonAdd, setButtonAdd] = useState(false);
    const [focusIndexPlayer, setFocusIndexPlayer] = useState(0);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isEnabledCouples, setIsEnabledCouples] = useState(false);
    const [countdown, setCountdown] = useState(6);
    const [isCounting, setIsCounting] = useState(false);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const toggleSwitchCouples = () => setIsEnabledCouples(previousState => !previousState);


    //useEffects
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setShowKeyboard(true)
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setShowKeyboard(false)
            }
        );
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);
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
    useEffect(() => {
        navigation.setOptions({
            headerShown: !isCounting
        });
    }, [navigation, isCounting]);
    //functions
    const handlePressButtonAdd = () => {
        setButtonAdd(true);
        setModalVisiblePlayer(false);
    }
    const handleOnChangeNewPlayer = (value) => {
        dispatch(onChangeNewPlayer(value))
    }
    const handleCreatePlayer = () => {
        const newPlayer = {
            id: scoreState.players.length > 0 ? scoreState.players[scoreState.players.length - 1].id + 1 : 1,
            victories: 0,
            points: 0,
            numberWhites: 0,
            name: scoreState.newPlayer,
            image: '',
        };
        dispatch(createPlayer(newPlayer))
        setModalVisibleAddPlayer(false)
    }
    const handlePressItemPlayer = (index) => {
        setFocusIndexPlayer(index)
        setModalVisiblePlayer(true)
    }
    const handleEditPlayer = (item) => {
        let focusPlayer = scoreState.playCouples && scoreState.playersPlay.find((item, index) => index === focusIndexPlayer);
        let pairsColor = focusPlayer && scoreState.playersPlay.find((item) => (item.pair === focusPlayer.pair && item?.backgroundColor))
        dispatch(editPlayerPlay({
            index: focusIndexPlayer,
            newValue: {
                id: item.id,
                name: item.name,
                points: 0,
                pointsRound: '',
                backgroundColor: (scoreState.playCouples && pairsColor?.backgroundColor) ? pairsColor?.backgroundColor : generateRandomColor(),
                victory: false,
                victoryPlace: 0,
                place: 0,
                numberEmpty: scoreState.numberEmpty,
                whiteActive: false,
                rounds: [],
                numberWhites: 0
            }
        }))
        setModalVisiblePlayer(false)
    }
    const handlePlayGame = () => {
        if (scoreState.playCouples) {
            if (isEnabledCouples) {
                dispatch(randomPlayerStart())
                setIsCounting(true);
                const play = (error, sound) => sound.play()
                const sound = new Sound(
                    require('../../assets/sounds/spin.mp3'),
                    (error) => play(error, sound),
                )
            } else {
                storeData(scoreState.playersPlay, '@playersPlay')
                navigation.navigate('Score')
            }

        } else {
            if (isEnabled) {
                dispatch(randomPlayerStart())
                setIsCounting(true);
                const play = (error, sound) => sound.play()
                const sound = new Sound(
                    require('../../assets/sounds/spin.mp3'),
                    (error) => play(error, sound),
                )
            } else {
                storeData(scoreState.playersPlay, '@playersPlay')
                navigation.navigate('Score')
            }
        }
    }
    //components
    const _renderItem = ({ item, index }) =>
    (
        <ItemPlayer
            item={item}
            playCouples={scoreState.playCouples}
            action={handlePressItemPlayer}
            setModalVisible={setModalVisiblePlayer}
            index={index} />
    )

    return (
        <View style={isCounting ? { ...styles.root, justifyContent: 'center' } : { ...styles.root, paddingBottom: 120 }}>
            {
                isCounting ?
                    <Spin width={350} height={350} />
                    :
                    <>
                        <ModalPlayer
                            setModalVisible={setModalVisiblePlayer}
                            isVisible={isModalVisiblePlayer}
                            handlePressButtonAdd={handlePressButtonAdd}
                            setModalVisibleAdd={setModalVisibleAddPlayer}
                            pressButtonAdd={pressButtonAdd}
                            setButtonAdd={setButtonAdd}
                            players={listPlayers}
                            handleEditPlayer={handleEditPlayer}
                        />
                        <ModalAddPlayer
                            setModalVisible={setModalVisibleAddPlayer}
                            isVisible={isModalVisibleAddPlayer}
                            keyboardActive={showKeyboard}
                            setModalVisiblePlayer={setModalVisiblePlayer}
                            onChangeNewPlayer={handleOnChangeNewPlayer}
                            createPlayer={handleCreatePlayer}
                            newPlayer={scoreState.newPlayer}
                            setButtonAdd={setButtonAdd}
                        />
                        <FlatList
                            contentContainerStyle={{ paddingBottom: 50 }}
                            style={{ width: '100%', paddingHorizontal: 30 }}
                            data={scoreState.playersPlay}
                            renderItem={_renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <View style={{ position: 'absolute', bottom: 20, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                            {
                                scoreState.playCouples ?
                                    <View style={{ marginBottom: 15, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 20, color: colors.black }}>Sortear Parejas</Text>
                                        <Switch
                                            trackColor={{ false: '#767577', true: colors.primary }}
                                            thumbColor={isEnabledCouples ? colors.white : '#f4f3f4'}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={toggleSwitchCouples}
                                            value={isEnabledCouples}
                                        />
                                    </View>
                                    :
                                    <View style={{ marginBottom: 15, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 20, color: colors.black }}>Sortear salida</Text>
                                        <Switch
                                            trackColor={{ false: '#767577', true: colors.primary }}
                                            thumbColor={isEnabled ? colors.white : '#f4f3f4'}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={toggleSwitch}
                                            value={isEnabled}
                                        />
                                    </View>
                            }

                            <ButtonPrincipal action={handlePlayGame} disabled={scoreState.playersPlay.some((player) => player === null) || !scoreState.playersPlay.some((player) => player?.id)} text={'Empezar juego'} />
                        </View>
                    </>
            }
        </View>
    )
}

export default Player

const styles = StyleSheet.create({
    root: {
        height: '100%',
        width: '100%',
        flex: 1,
        alignItems: 'center',
        paddingTop: 10,
    }
})