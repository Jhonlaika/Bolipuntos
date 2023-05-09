import { createSlice } from '@reduxjs/toolkit'
import { storeData } from '../../../utils/storage';
import { generateRandomColor } from '../../../utils/constants';

const initialState = {
    numberPlayers: 2,
    numberTotal: 1500,
    numberEmpty: 50,
    randomEmpty: false,
    playCouples: false,
    numberPlayerWinRandom: 1,
    numberRoundsEliminated: 1,
    activeNumberPlayerWinRandom: false,
    noPlayer: false,
    round: 1,
    players: [],
    playersPlay: [],
    newPlayer: '',
    winner: 0,
    gameMode: ''
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
        addNumberPlayerWinRandom: (state) => {
            state.numberPlayerWinRandom += 1;
        },
        removeNumberPlayerWinRandom: (state) => {
            state.numberPlayerWinRandom -= 1;
        },
        onChangeNumberPlayerWinRandom: (state, action) => {
            state.numberPlayerWinRandom = action.payload
        },
        setNoPlayer: (state) => {
            state.noPlayer = !state.noPlayer
        },
        setActiveNumberPlayerWinRandom: (state) => {
            state.activeNumberPlayerWinRandom = !state.activeNumberPlayerWinRandom
        },
        onChangeNewPlayer: (state, action) => {
            state.newPlayer = action.payload
        },
        createPlayer: (state, action) => {
            state.players = [...state.players, action.payload]
            storeData(state.players, '@players')
            state.newPlayer = ''
        },
        getPlayers: (state, action) => {
            state.players = action.payload
        },
        getPlayersPlay: (state, action) => {
            state.playersPlay = action.payload
        },
        addPlayersPlay: (state, action) => {
            const { numberPlayers, activeNumberPlayerWinRandom, numberTotal, numberEmpty, randomEmpty, playCouples, round, gameMode, numberPlayerWinRandom, noPlayer, numberRoundsEliminated } = state;
            state.playersPlay = action.payload
            storeData({
                numberPlayers,
                numberTotal,
                numberEmpty,
                randomEmpty,
                playCouples,
                numberPlayerWinRandom,
                activeNumberPlayerWinRandom,
                numberRoundsEliminated,
                noPlayer,
                round,
                winner: 0,
                gameMode
            }, '@config')
        },
        editPlayerPlay: (state, action) => {
            const { index, newValue } = action.payload;
            state.playersPlay[index] = { ...state.playersPlay[index], ...newValue }
        },
        onChangePointsRound: (state, action) => {
            const { id, newValue } = action.payload;
            let totalPoints = 0;
            let playerFind = state.playersPlay.find(player => player.id === id);
            let currentVictoryPlace = playerFind.victoryPlace;
            let pairValue = playerFind.pair;

            if (state.playCouples) {
                state.playersPlay.forEach(player => {
                    if (player.pair === pairValue) {
                        totalPoints += player.points;
                    }
                });
                totalPoints = (totalPoints + (newValue ? parseInt(newValue) : 0)) > state.numberTotal ? state.numberTotal : (totalPoints + (newValue ? parseInt(newValue) : 0));
            } else {
                totalPoints = (playerFind.points + (newValue ? parseInt(newValue) : 0)) > state.numberTotal ? state.numberTotal : (playerFind.points + (newValue ? parseInt(newValue) : 0))
            }
            if (totalPoints >= state.numberTotal && state.gameMode !== 'eliminated') {
                let playerWithMaxVictoryPlace = state.playersPlay.reduce((prevPlayer, currentPlayer) => {
                    return (currentPlayer.victoryPlace > prevPlayer.victoryPlace) ? currentPlayer : prevPlayer;
                })
                if (!(playerFind.pointsRound === parseInt(newValue))) {
                    currentVictoryPlace = playerWithMaxVictoryPlace.victoryPlace + 1;
                }
            } else {
                currentVictoryPlace = 0
            }
            if (!state.playCouples) {
                state.playersPlay = state.playersPlay.map((obj) => {
                    if (obj.id === id) {
                        return { ...obj, victoryPlace: currentVictoryPlace, pointsRound: newValue ? newValue === '-' ? '-' : !isNaN(parseInt(newValue)) ? parseInt(newValue) : '' : '' }
                    } else {
                        return obj
                    }
                })
            } else {
                state.playersPlay = state.playersPlay.map((obj) => {
                    return { ...obj, victoryPlace: obj.pair === pairValue ? currentVictoryPlace : obj.victoryPlace, pointsRound: obj.id === id ? newValue ? newValue === '-' ? '-' : !isNaN(parseInt(newValue)) ? parseInt(newValue) : '' : '' : obj.pointsRound }
                })
            }
        },
        editPlayerPoints: (state) => {
            const { numberPlayers, activeNumberPlayerWinRandom, numberTotal, numberEmpty, randomEmpty, playCouples, gameMode, numberPlayerWinRandom, noPlayer, numberRoundsEliminated } = state;
            state.playersPlay = state.playersPlay.map((obj) => {
                let findPlayer = state.playersPlay.find((item, index) => (item.pair === obj.pair) && (state.round % 2 === 0 ? index % 2 !== 0 : index % 2 === 0));
                return {
                    ...obj,
                    points: obj.points + obj.pointsRound - (obj.whiteActive ? obj.numberEmpty : 0),
                    pointsRound: '',
                    rounds: [...obj.rounds, state.playCouples ? (findPlayer.whiteActive ? `${findPlayer.name} ${(-findPlayer.numberEmpty)}` : `${findPlayer.name} ${findPlayer.pointsRound}`) : (obj.whiteActive ? (-obj.numberEmpty) : obj.pointsRound)],
                    numberWhites: obj.whiteActive ? obj.numberWhites + 1 : obj.numberWhites,
                    whiteActive: false
                }
            })
            let sumByPair = {};
            for (let i = 0; i < state.playersPlay.length; i++) {
                let player = state.playersPlay[i];
                let pair = player.pair;
                let points = player.points;

                if (sumByPair[pair]) {
                    sumByPair[pair] += points;
                } else {
                    sumByPair[pair] = points;
                }
            }
            let playerWin = state.playersPlay.find(player => player.victoryPlace === 1);
            let temporalPlayers = [...state.playersPlay];
            let sortedPlayers = state.playCouples ? temporalPlayers.sort((a, b) => sumByPair[b.pair] - sumByPair[a.pair]) : temporalPlayers.sort((a, b) => b.points - a.points);
            state.playersPlay = state.playersPlay.map((obj) => {
                return {
                    ...obj,
                    points: (obj.points + obj.pointsRound - (obj.whiteActive ? obj.numberEmpty : 0)) > state.numberTotal ? state.numberTotal : (obj.points + obj.pointsRound - (obj.whiteActive ? obj.numberEmpty : 0)),
                    place: state.playCouples ? ((sortedPlayers.findIndex(player => player.pair === obj.pair)) / 2) + 1 : (sortedPlayers.findIndex(player => player.id === obj.id)) + 1,
                    pointsRound: '',
                    victory: obj.victoryPlace >= 1 ? true : false,
                    numberWhites: obj.whiteActive ? obj.numberWhites + 1 : obj.numberWhites,
                    whiteActive: false
                }
            })
            state.winner = playerWin?.id ? playerWin.id : 0;
            state.round = state.round + 1;
            storeData({
                numberPlayers,
                numberTotal,
                numberEmpty,
                randomEmpty,
                playCouples,
                numberPlayerWinRandom,
                activeNumberPlayerWinRandom,
                numberRoundsEliminated,
                noPlayer,
                round: state.round,
                winner: playerWin?.id ? playerWin.id : 0,
                gameMode
            }, '@config')
            storeData(state.playersPlay, '@playersPlay')
        },
        changeWhiteBlank: (state, action) => {
            const { id } = action.payload;
            state.playersPlay = state.playersPlay.map((obj) => {
                if (obj.id === id) {
                    return { ...obj, pointsRound: '', whiteActive: !obj.whiteActive }
                } else {
                    return obj
                }
            })
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
            if (state.playCouples) {
                let players = [...state.playersPlay];
                function compareRandom() {
                    return Math.random() - 0.5;
                }
                players.sort(compareRandom);
                let currentPair = 1;
                for (let i = 0; i < players.length; i++) {
                    players[i].pair = currentPair;
                    if ((i + 1) % 2 === 0) {
                        currentPair++;
                    }
                }
                const backgroundColorMap = new Map();

                for (let i = 0; i < players.length; i++) {
                    const player = players[i];
                    if (!backgroundColorMap.has(player.pair)) {
                        backgroundColorMap.set(player.pair, player.backgroundColor);
                    } else {
                        player.backgroundColor = backgroundColorMap.get(player.pair);
                    }
                }
                state.playersPlay = players;
            } 
            else {
                state.playersPlay = state.playersPlay.sort(() => Math.random() - 0.5);
            }

            storeData(state.playersPlay, '@playersPlay')
        },
        randomOrderCouples: (state)=>{
            let players = state.playersPlay.sort(() => Math.random() - 0.5)
            let sortedPlayers = [];
            players.forEach(player => {
                const index = sortedPlayers.findIndex(p => p.pair === player.pair);
                if (index === -1) {
                  sortedPlayers.push(player);
                } else {
                  sortedPlayers.splice(index + 1, 0, player);
                }
              });  
              state.playersPlay =sortedPlayers 
        },
        setConfig: (state, action) => {
            Object.assign(state, action.payload);
        },
        setRandomEmpty: (state) => {
            state.randomEmpty = !state.randomEmpty
        },
        setPlayCouples: (state, action) => {
            state.playCouples = action.payload
        },
        onChangeEmptyPlayer: (state, action) => {
            const { id, numberEmpty } = action.payload;
            state.playersPlay = state.playersPlay.map((obj) => {
                if (obj.id === id) {
                    return { ...obj, numberEmpty: numberEmpty }
                } else {
                    return obj
                }
            })
        },
        setGameMode: (state, action) => {
            state.gameMode = action.payload
        },
        setVictoryPlayer: (state, action) => {
            let playerWithMaxVictoryPlace = state.playersPlay.reduce((prevPlayer, currentPlayer) => {
                return (currentPlayer.victoryPlace > prevPlayer.victoryPlace) ? currentPlayer : prevPlayer;
            });
            if (state.winner === 0) {
                state.winner = playerWithMaxVictoryPlace.id
            }
            if (action.payload.id !== 0) {
                if (state.playCouples) {
                    state.playersPlay = state.playersPlay.map(player => {
                        if (player.pair === state.playersPlay.find(player => player.id === action.payload.id).pair) {
                            return {
                                ...player,
                                victory: true,
                                victoryPlace: action.payload.changePlace ? playerWithMaxVictoryPlace.victoryPlace + 1 : playerWithMaxVictoryPlace.victoryPlace,
                                points: state.numberTotal
                            };
                        } else {
                            return player;
                        }
                    });
                } else {
                    state.playersPlay = state.playersPlay.map(player => {
                        if (player.id === action.payload.id) {
                            return {
                                ...player,
                                victory: true,
                                victoryPlace: action.payload.changePlace ? playerWithMaxVictoryPlace.victoryPlace + 1 : playerWithMaxVictoryPlace.victoryPlace,
                                points: state.numberTotal
                            };
                        } else {
                            return player;
                        }
                    });
                }
            }
        },
        restartGame: (state) => {
            const { numberPlayers, activeNumberPlayerWinRandom, numberTotal, numberEmpty, randomEmpty, playCouples, gameMode, numberPlayerWinRandom, noPlayer, numberRoundsEliminated } = state;
            state.round = 1
            state.winner = 0
            state.playersPlay = state.playersPlay.map((obj) => {
                return { ...obj, points: 0, backgroundColor: generateRandomColor(), pointsRound: '',eliminated:false ,victory: false, victoryPlace: 0, place: 0, rounds: [], numberWhites: 0 }
            })
            storeData({
                numberPlayers,
                numberTotal,
                numberEmpty,
                randomEmpty,
                playCouples,
                numberPlayerWinRandom,
                activeNumberPlayerWinRandom,
                numberRoundsEliminated,
                noPlayer,
                round:1,
                winner: 0,
                gameMode
            }, '@config')
            storeData(state.playersPlay, '@playersPlay')
        },
        addNumberRoundsEliminated: (state) => {
            state.numberRoundsEliminated += 1;
        },
        removeNumberRoundsEliminated: (state) => {
            state.numberRoundsEliminated -= 1;
        },
        onChangeNumberRoundsEliminated: (state, action) => {
            state.numberRoundsEliminated = action.payload
        },
        addElementPlayer: (state,action)=>{
            const {key,value}=action.payload
            state.playersPlay = state.playersPlay.map((obj) => {
                return { ...obj,[key]:value}
            })
            storeData(state.playersPlay, '@playersPlay')
        },
        resetRoundsGame: (state,action)=>{
            const { numberPlayers, activeNumberPlayerWinRandom, numberTotal, numberEmpty, randomEmpty, playCouples, gameMode, numberPlayerWinRandom, noPlayer, numberRoundsEliminated } = state;
            if(state.playCouples){
                state.playersPlay = state.playersPlay.map(player => {
                    if (player.pair === state.playersPlay.find(player => player.id === action.payload).pair) {
                        return { ...player,points:0,pointsRound:'',place:0,eliminated:true,rounds:[]}
                    } else {
                        return { ...player,points:0,pointsRound:'',place:0,rounds:[]}
                    }
                });
            }else{
                state.playersPlay = state.playersPlay.map((obj) => {
                    if(obj.id === action.payload){
                        return { ...obj,points:0,pointsRound:'',place:0,eliminated:true,rounds:[]}
                    }else{
                        return { ...obj,points:0,pointsRound:'',place:0,rounds:[]}
                    }
                })
            }
            state.round=1
            storeData({
                numberPlayers,
                numberTotal,
                numberEmpty,
                randomEmpty,
                playCouples,
                numberPlayerWinRandom,
                activeNumberPlayerWinRandom,
                numberRoundsEliminated,
                noPlayer,
                round:1,
                winner: 0,
                gameMode
            }, '@config')
            storeData(state.playersPlay, '@playersPlay')
        }
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
    setPlayCouples,
    setGameMode,
    setVictoryPlayer,
    restartGame,
    addNumberPlayerWinRandom,
    removeNumberPlayerWinRandom,
    onChangeNumberPlayerWinRandom,
    setNoPlayer,
    setActiveNumberPlayerWinRandom,
    addNumberRoundsEliminated,
    removeNumberRoundsEliminated,
    onChangeNumberRoundsEliminated,
    addElementPlayer,
    resetRoundsGame,
    randomOrderCouples
} = scoreSlice.actions;

export default scoreSlice.reducer;