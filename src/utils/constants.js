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

export function generateRandomColor() {
    // Componentes RGB aleatorios
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
  
    const color = `rgb(${r},${g},${b})`;
    return color;
  }