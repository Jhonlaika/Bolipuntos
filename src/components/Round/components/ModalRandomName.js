import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import { colors } from '../../../utils/constants';
import ButtonPrincipal from '../../commons/Buttons/ButtonPrincipal';

const ModalRandomName = ({ isGenerating,playersPlay,playCouples, isVisible, setModalVisible, randomName, handleRandomName }) => {
    return (
        <Modal
            propagateSwipe={true}
            backdropOpacity={0.35}
            animationInTiming={1}
            animationOutTiming={1}
            isVisible={isVisible}
        >
            <View style={styles.containerRootModal}>
                {
                    randomName?.name ?
                        <>
                            <TouchableOpacity onPress={() => setModalVisible()} style={styles.close}>
                                {
                                    !isGenerating &&
                                    <Text style={styles.titleClose}>x</Text>
                                }
                            </TouchableOpacity>
                            <Text style={styles.textTitle}>{playCouples ? 'La pareja ganadora es:' :'El ganador es:'}</Text>
                            {(playCouples && !isGenerating) ?
                                <Text style={{ ...styles.textNumber, color: randomName?.backgroundColor ? randomName.backgroundColor : colors.black }}>{randomName?.name ?  `${randomName.name} y ${playersPlay.find(player=>(player.id !== randomName.id && player.pair ===randomName.pair)).name}` : 0}</Text>
                                :
                                <Text style={{ ...styles.textNumber, color: randomName?.backgroundColor ? randomName.backgroundColor : colors.black }}>{randomName?.name ? randomName.name : 0}</Text>
                            }
                        </>
                        :
                        <>
                            <Text style={styles.textTitle}>Presiona para sortear el ganador</Text>
                            <ButtonPrincipal action={handleRandomName} width={200} text={'Sortear'} />
                        </>
                }
            </View>
        </Modal>
    )
}

export default ModalRandomName

const styles = StyleSheet.create({
    containerRootModal: {
        backgroundColor: colors.white,
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        height: '30%',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    textNumber: {
        fontSize: 50,
        color: colors.black
    },
    textTitle: {
        fontSize: 23,
        fontWeight: '800',
        marginTop: 30,
        marginBottom: 40,
        color: colors.black,
        textAlign: 'center'
    },
    close: {
        position: 'absolute',
        right: 10,
        top: 0,
        padding: 10
    },
    titleClose: {
        fontSize: 25,
        fontWeight: '900',
        color: colors.black
    }
})