import { createSlice } from '@reduxjs/toolkit'
import { storeData } from '../../../utils/storage';

const initialState = {
    numberPlayers: 1,
    numberTotal: 1500,
    numberEmpty: 50,
    randomEmpty:false,
    playCouples:false,
    round:1,
    players: [],
    playersPlay: [],
    newPlayer: '',
    winner:0
}
export const scoreSlice = createSlice({
    name: 'score',
    initialState,
    reducers: {
        addPlayer: (state) => {
            state.numberPlayers += 1;
        },
        removePlayer: (state) => {
            state.numberPlayers -= 1;
        },
        onChangePlayers: (state, action) => {
            state.numberPlayers = action.payload
        },
        addTotal: (state) => {
            state.numberTotal += 1;
        },
        removeTotal: (state) => {
            state.numberTotal -= 1;
        },
        onChangeTotal: (state, action) => {
            state.numberTotal = action.payload
        },
        addEmpty: (state) => {
            state.numberEmpty += 1;
        },
        removeEmpty: (state) => {
            state.numberEmpty -= 1;
        },
        onChangeEmpty: (state, action) => {
            state.numberEmpty = action.payload
        },
        onChangeNewPlayer: (state, action) => {
            state.newPlayer = action.payload
        },
        createPlayer: (state, action) => {
            state.players = [...state.players, action.payload]
            storeData(state.players, '@players')
        },
        getPlayers: (state, action) => {
            state.players = action.payload
        },
        getPlayersPlay: (state, action) => {
            state.playersPlay = action.payload
        },
        addPlayersPlay: (state, action) => {
            state.playersPlay = action.payload
            storeData({
                numberPlayers: state.numberPlayers,
                numberTotal: state.numberTotal,
                numberEmpty: state.numberEmpty,
                randomEmpty: state.randomEmpty,
                playCouples: state.playCouples,
                round:state.round,
                winner:0
            }, '@config')
        },
        editPlayerPlay: (state, action) => {
            const { index, newValue } = action.payload;
            state.playersPlay[index] = newValue
        },
        onChangePointsRound: (state, action) => {
            const { index, newValue } = action.payload;
            let totalPoints = state.playersPlay[index].points + (newValue ? parseInt(newValue) : 0);
            let currentVictoryPlace = state.playersPlay[index].victoryPlace;
            if (totalPoints >= state.numberTotal) {
                state.playersPlay.forEach((player, i) => {
                    if (i !== index && player.victoryPlace > currentVictoryPlace) {
                        currentVictoryPlace = player.victoryPlace + 1;
                    }
                });
                if (currentVictoryPlace === state.playersPlay[index].victoryPlace) {
                    currentVictoryPlace = 1;
                }
            } else {
                currentVictoryPlace = 0
            }
            state.playersPlay[index] = { ...state.playersPlay[index], victoryPlace: currentVictoryPlace, pointsRound: newValue ? parseInt(newValue) : '' }
        },
        editPlayerPoints: (state) => {
            state.playersPlay = state.playersPlay.map((obj) => {
                return { ...obj, points: obj.points + obj.pointsRound - (obj.whiteActive ? obj.numberEmpty : 0), pointsRound: '',rounds:[...obj.rounds,obj.whiteActive ? (-obj.numberEmpty) : obj.pointsRound], numberWhites: obj.whiteActive ? obj.numberWhites + 1 : obj.numberWhites, whiteActive: false }
            })
            let playerWin = state.playersPlay.find(player => player.victoryPlace === 1);
            let temporalPlayers = [...state.playersPlay];
            let sortedPlayers = temporalPlayers.sort((a, b) => b.points - a.points);
            state.playersPlay = state.playersPlay.map((obj) => {
                return { ...obj, points: (obj.points + obj.pointsRound - (obj.whiteActive ? obj.numberEmpty : 0))>state.numberTotal ? state.numberTotal:(obj.points + obj.pointsRound - (obj.whiteActive ? obj.numberEmpty : 0)), place: (sortedPlayers.findIndex(player => player.id === obj.id)) + 1, pointsRound: '',victory:obj.victoryPlace>=1 ?true:false,numberWhites: obj.whiteActive ? obj.numberWhites + 1 : obj.numberWhites, whiteActive: false }
            })
            state.winner=playerWin?.id ? playerWin.id:0;
            state.round=state.round+1;
            storeData({
                numberPlayers: state.numberPlayers,
                numberTotal: state.numberTotal,
                numberEmpty: state.numberEmpty,
                randomEmpty: state.randomEmpty,
                playCouples: state.playCouples,
                round:state.round,
                winner: playerWin?.id ? playerWin.id:0
            }, '@config')
            storeData(state.playersPlay, '@playersPlay')
        },
        changeWhiteBlank: (state, action) => {
            const { index } = action.payload;
            state.playersPlay[index] = { ...state.playersPlay[index], pointsRound: '', whiteActive: !state.playersPlay[index].whiteActive }
        },
        addTotalPoints: (state, action) => {
            const { index } = action.payload;
            state.playersPlay[index] = { ...state.playersPlay[index], pointsRound: (state.playersPlay[index].pointsRound) + 1 }
        },
        removeTotalPoints: (state, action) => {
            const { index } = action.payload;
            state.playersPlay[index] = { ...state.playersPlay[index], pointsRound: (state.playersPlay[index].pointsRound) - 1 }
        },
        randomPlayerStart: (state) => {
            state.playersPlay = state.playersPlay.sort(() => Math.random() - 0.5);
            storeData(state.playersPlay, '@playersPlay')
        },
        setConfig: (state, action) => {
            const { numberPlayers, numberEmpty,randomEmpty,numberTotal,winner,round,playCouples} = action.payload
            state.numberPlayers = numberPlayers
            state.numberEmpty = numberEmpty
            state.randomEmpty=randomEmpty
            state.playCouples =playCouples
            state.numberTotal = numberTotal
            state.winner = winner
            state.round =round
        },
        setRandomEmpty:(state)=>{
            state.randomEmpty=!state.randomEmpty
        },
        setPlayCouples:(state)=>{
            state.playCouples=!state.playCouples
        },
        onChangeEmptyPlayer: (state, action) => {
            const { index,numberEmpty } = action.payload;
            state.playersPlay[index] = { ...state.playersPlay[index], numberEmpty: numberEmpty }
        },
    }
})
export const {
    onChangePlayers,
    removePlayer,
    addPlayer,
    onChangeEmpty,
    removeEmpty,
    addEmpty,
    onChangeTotal,
    removeTotal,
    addTotal,
    onChangeNewPlayer,
    createPlayer,
    getPlayers,
    addPlayersPlay,
    editPlayerPlay,
    onChangePointsRound,
    editPlayerPoints,
    getPlayersPlay,
    changeWhiteBlank,
    addTotalPoints,
    removeTotalPoints,
    randomPlayerStart,
    setConfig,
    setRandomEmpty,
    onChangeEmptyPlayer,
    setPlayCouples
} = scoreSlice.actions;

export default scoreSlice.reducer;