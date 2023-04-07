import { StyleSheet, View, FlatList, Text, BackHandler, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import ItemPlayer from '../Player/components/ItemPlayer';
import ButtonPrincipal from '../commons/Buttons/ButtonPrincipal';
import { colors } from '../../utils/constants';
import { removeValue, storeData } from '../../utils/storage';
import { setConfig } from '../../state/features/score/reducers';

const Score = ({ navigation, route }) => {
    const scoreState = useSelector(state => state.score);
    const dispatch = useDispatch();
    //function
    const handleNextRound = () => {
        navigation.navigate('Round')

    }
    const handleFinishGame = () => {
        navigation.navigate('Home')
        dispatch(setConfig({
            numberPlayers: 1,
            numberTotal: 1500,
            numberEmpty: 50,
            randomEmpty: false,
            playCouples: false,
            round: 1,
            winner: 0
        }))
        storeData({
            numberPlayers: 1,
            numberTotal: 1500,
            numberEmpty: 50,
            randomEmpty: false,
            playCouples: false,
            round: 1,
            winner: 0
        }, '@config')
        removeValue('@playersPlay')
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

                return scoreState.numberTotal-totalPoints;
            }
        } else {
            return scoreState.numberTotal - item.points;
        }
    }

    //useEffects
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {

        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style={{ paddingVertical: 10 }} onPress={handleMenuFinishGame}>
                    <Text style={{ color: colors.white }}>Terminar juego</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);
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
            index={index} />
    )
    return (
        <View style={styles.root}>
            <Text style={styles.title}>Puntuación a ganar: <Text>{scoreState.numberTotal}</Text></Text>
            <FlatList
                contentContainerStyle={{ paddingBottom: 50, alignItems: 'center' }}
                numColumns={2}
                data={scoreState.playersPlay}
                renderItem={_renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={{ position: 'absolute', bottom: 10 }}>
                <ButtonPrincipal action={handleNextRound} text={'Siguiente Ronda'} />
            </View>
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