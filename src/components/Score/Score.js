import { StyleSheet, View, FlatList, Text, BackHandler, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux';
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
            randomEmpty:false,
            playCouples:false,
            round:1,
            winner:0
        }))
        storeData({
            numberPlayers: 1,
            numberTotal: 1500,
            numberEmpty: 50,
            randomEmpty:false,
            playCouples:false,
            round:1,
            winner:0
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
            points={item.points}
            scoreTotal={scoreState.numberTotal}
            score
            disabled
            victoryPlace={item.victoryPlace}
            item={item}
            index={index} />
    )
    return (
        <View style={styles.root}>
            <Text style={styles.title}>Puntuación a ganar: <Text>{scoreState.numberTotal}</Text></Text>
            <FlatList
                contentContainerStyle={{ paddingBottom: 50, alignItems: 'center' }}
                style={{ width: '100%', paddingHorizontal: 10 }}
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