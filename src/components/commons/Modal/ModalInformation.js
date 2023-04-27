import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import { colors, fontFamily } from '../../../utils/constants';
import IconAwesome from 'react-native-vector-icons/FontAwesome5';

const ModalInformation = ({ isVisible, setModalVisible, handleTextModal }) => {
    return (
        <Modal
            propagateSwipe={true}
            backdropOpacity={0.35}
            animationInTiming={1}
            animationOutTiming={1}
            isVisible={isVisible}
        >
            <View style={styles.containerRootModal}>
                <TouchableOpacity onPress={() => setModalVisible()} style={styles.close}>
                    <IconAwesome size={25} color={colors.black} name='times' />
                </TouchableOpacity>
                <IconAwesome size={35} color={colors.primary} name='info-circle' />
                <Text style={styles.text}>{handleTextModal()}</Text>
            </View>
        </Modal>
    )
}

export default ModalInformation

const styles = StyleSheet.create({
    containerRootModal: {
        backgroundColor: colors.white,
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        height: 'auto',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingVertical: 40,
        paddingHorizontal: 20
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        color: colors.black,
        marginTop: 20,
        fontFamily: fontFamily.fontFamilyRegular
    },
    textTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 10,
        color: colors.black
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