import LottieView from "lottie-react-native";
import React from "react";
const Spin =(props)=>{
    return(
      <LottieView style={{width:props.width ? props.width:200,height:props.height?props.height:200}} source={require('../../assets/lotties/spin')} autoPlay/>
    )
};
export default Spin;