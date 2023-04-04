export const colors = {
    primary: '#52be80',
    white:'#FFFF',
    black:'#17202a',
    gray: "#a8a8a8",
}

export function generateRandomColor() {
    // Componentes RGB aleatorios
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
  
    const color = `rgb(${r},${g},${b})`;
    return color;
  }