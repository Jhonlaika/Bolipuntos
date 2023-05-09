export const colors = {
    primary: '#52be80',
    secondary:'#196f3d',
    white:'#FFFF',
    black:'#17202a',
    gray: "#a8a8a8",
}
export const fontFamily = {
    fontFamilyBlack:'Lato-Black',
    fontFamilyBlackItalic:'Lato-BlackItalic',
    fontFamilyBold:'Lato-Bold',
    fontFamilyBoldItalic:'Lato-BoldItalic', 
    fontFamilyItalic:'Lato-Italic', 
    fontFamilyLight:'Lato-Light',
    fontFamilyLightItalic:'Lato-LightItalic',  
    fontFamilyRegular:'Lato-Regular',
    fontFamilyThin:'Lato-Thin',
    fontFamilyThinItalic:'Lato-ThinItalic',
}
export const stateInitial ={
    numberPlayers: 2,
    numberTotal: 1500,
    numberEmpty: 50,
    randomEmpty: false,
    playCouples: false,
    round: 1,
    winner: 0,
    gameMode: '',
    numberPlayerWinRandom:1,
    numberRoundsEliminated:1,
    activeNumberPlayerWinRandom:false,
    noPlayer:false,
}
export const deletionMessages = [
    "Bueno, al menos tienes más tiempo para jugar a otros juegos ahora...",
    "Lo siento mucho por tu pérdida... pero al menos no apostaste tu casa, ¿verdad? ¿Verdad?",
    "Parece que tu suerte se ha agotado. Mejor suerte la próxima vez...si es que la hay.",
    "No te preocupes, todavía eres el número uno en nuestro corazón...de hecho, eres el único.",
    "No te preocupes, seguro que tu mascota te seguirá queriendo a pesar de todo.",
    "¿Esa fue tu mejor actuación? Ni siquiera parecías estar tratando...",
    "Bueno, si alguna vez necesitas un compañero de equipo para perder, ya sabes a quién llamar.",
    "Eres un jugador excelente...para la gente que quiere perder.",
    "Parece que has alcanzado la cima de tu capacidad...que no es muy alta, por cierto.",
    "Bueno, al menos eres bueno en algo: en perder.",
    "No te preocupes, todos tenemos nuestros días malos. Solo que el tuyo parece ser una temporada completa.",
    "No te preocupes, alguien tiene que ser el perdedor en este juego, y afortunadamente, tienes mucho talento en eso"
]
export function generateRandomColor() {
    // Componentes RGB aleatorios
    const r = Math.floor(Math.random() * 150);
    const g = Math.floor(Math.random() * 150);
    const b = Math.floor(Math.random() * 150);
  
    const color = `rgb(${r},${g},${b})`;
    return color;
  }