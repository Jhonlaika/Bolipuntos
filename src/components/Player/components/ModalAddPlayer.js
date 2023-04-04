import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import { colors } from '../../../utils/constants';
import ButtonPrincipal from '../../commons/Buttons/ButtonPrincipal';

const ModalAddPlayer = ({ isVisible,keyboardActive,setModalVisible,onChangeNewPlayer,createPlayer,newPlayer,setModalVisiblePlayer,setButtonAdd}) => {
    return (
        <Modal
            propagateSwipe={true}
            backdropOpacity={0.35}
            animationInTiming={1}
            animationOutTiming={1}
            onModalHide={
                () => {
                    setModalVisiblePlayer(true)
                    setButtonAdd(false)
                }
            }
            onBackdropPress={() => setModalVisible(false)}
            isVisible={isVisible}
        >
            <View style={{...styles.containerRootModal,height:keyboardActive? '50%':'32%'}}>
                <Text style={styles.title}>Nombre de tu jugador</Text>
                <TextInput value={newPlayer} onChangeText={onChangeNewPlayer} style={styles.input}/>
                <View style={{position:'absolute',bottom:20}}>
                    <ButtonPrincipal disabled={newPlayer ? false:true} action={createPlayer} width={250} text={'Guardar jugador'} />
                </View>
            </View>
        </Modal>
    )
}

export default ModalAddPlayer

const styles = StyleSheet.create({
    containerRootModal: {
        backgroundColor: colors.white,
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
        paddingTop: 30
    },
    title: {
        marginBottom: 20,
        fontSize: 18,
        color:colors.black 
    },
    input: {
        borderBottomWidth: 1,
        width: '60%',
        textAlign: 'center',
        marginHorizontal: 15,
        fontSize: 20,
        borderColor:colors.primary,
        marginTop:30,
        color:colors.black
      },
})