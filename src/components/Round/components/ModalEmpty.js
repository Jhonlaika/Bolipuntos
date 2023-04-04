import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import { colors } from '../../../utils/constants';

const ModalEmpty = ({ isGenerating,isVisible, setModalVisible, randomNumber }) => {
    return (
        <Modal
            propagateSwipe={true}
            backdropOpacity={0.35}
            animationInTiming={1}
            animationOutTiming={1}
            isVisible={isVisible}
        >
            <View style={styles.containerRootModal}>
                <TouchableOpacity onPress={()=>setModalVisible()} style={styles.close}>
                    {
                        !isGenerating &&
                        <Text style={styles.titleClose}>x</Text>
                    }
                </TouchableOpacity>
                <Text style={styles.textTitle}>Numero al azar</Text>
                <Text style={styles.textNumber}>{randomNumber ? randomNumber : 0}</Text>
            </View>
        </Modal>
    )
}

export default ModalEmpty

const styles = StyleSheet.create({
    containerRootModal: {
        backgroundColor: colors.white,
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        height: '25%',
        alignItems: 'center',
        marginHorizontal: 20,
        justifyContent: 'center',
    },
    textNumber: {
        fontSize: 45,
        color:colors.black
    },
    textTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 10,
        color:colors.black
    },
    close: {
        position: 'absolute',
        right: 10,
        top: 0,
        padding: 10
    },
    titleClose: {
        fontSize:25,
        fontWeight:'900',
        color:colors.black
    }
})