import { createSlice } from '@reduxjs/toolkit'
import { storeData } from '../../../utils/storage';
import { generateRandomColor } from '../../../utils/constants';

const initialState = {
    numberPlayers: 2,
    numberTotal: 1500,
    numberEmpty: 50,
    numberPlayerWinRandom:1,
    randomEmpty: false,
    playCouples: false,
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
        onChangeNewPlayer: (state, action) => {
            state.newPlayer = action.payload
        },
        createPlayer: (state, action) => {
            state.players = [...state.players, action.payload]
            storeData(state.players, '@players')
            state.newPlayer=''
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
                round: state.round,
                winner: 0,
                gameMode: state.gameMode
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
            if (totalPoints >= state.numberTotal) {
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
                        return { ...obj, victoryPlace: currentVictoryPlace, pointsRound: newValue ? parseInt(newValue) : '' }
                    } else {
                        return obj
                    }
                })
            } else {
                state.playersPlay = state.playersPlay.map((obj) => {
                    return { ...obj, victoryPlace: obj.pair === pairValue ? currentVictoryPlace : obj.victoryPlace, pointsRound: obj.id === id ? newValue ? parseInt(newValue) : '' : obj.pointsRound }
                })
            }
        },
        editPlayerPoints: (state) => {
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
                return { ...obj, points: (obj.points + obj.pointsRound - (obj.whiteActive ? obj.numberEmpty : 0)) > state.numberTotal ? state.numberTotal : (obj.points + obj.pointsRound - (obj.whiteActive ? obj.numberEmpty : 0)), place: state.playCouples ? ((sortedPlayers.findIndex(player => player.pair === obj.pair)) / 2) + 1 : (sortedPlayers.findIndex(player => player.id === obj.id)) + 1, pointsRound: '', victory: obj.victoryPlace >= 1 ? true : false, numberWhites: obj.whiteActive ? obj.numberWhites + 1 : obj.numberWhites, whiteActive: false }
            })
            state.winner = playerWin?.id ? playerWin.id : 0;
            state.round = state.round + 1;
            storeData({
                ...state,
                winner: playerWin?.id ? playerWin.id : 0,
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
            } else {
                state.playersPlay = state.playersPlay.sort(() => Math.random() - 0.5);
            }

            storeData(state.playersPlay, '@playersPlay')
        },
        setConfig: (state, action) => {
            const { numberPlayers, numberEmpty, randomEmpty, numberTotal, winner, round, playCouples, gameMode } = action.payload
            state.numberPlayers = numberPlayers
            state.numberEmpty = numberEmpty
            state.randomEmpty = randomEmpty
            state.playCouples = playCouples
            state.numberTotal = numberTotal
            state.winner = winner
            state.round = round
            state.gameMode = gameMode
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
            if (action.payload !== 0) {
                if (state.playCouples) {
                    state.playersPlay = state.playersPlay.map(player => {
                        if (player.pair === state.playersPlay.find(player => player.id === action.payload).pair) {
                            return {
                                ...player,
                                victory: true,
                                victoryPlace: playerWithMaxVictoryPlace.victoryPlace + 1,
                                points: state.numberTotal
                            };
                        } else {
                            return player;
                        }
                    });
                } else {
                    state.playersPlay = state.playersPlay.map(player => {
                        if (player.id === action.payload) {
                            return {
                                ...player,
                                victory: true,
                                victoryPlace: playerWithMaxVictoryPlace.victoryPlace + 1,
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
            state.round = 1
            state.winner = 0
            state.playersPlay = state.playersPlay.map((obj) => {
                return { ...obj, points: 0, backgroundColor: generateRandomColor(), pointsRound: '', victory: false, victoryPlace: 0, place: 0, rounds: [], numberWhites: 0 }
            })
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
    restartGame
} = scoreSlice.actions;

export default scoreSlice.reducer;