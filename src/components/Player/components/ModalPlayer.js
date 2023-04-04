import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import { colors } from '../../../utils/constants';
import Empty from '../../lotties/Empty';
import ButtonPrincipal from '../../commons/Buttons/ButtonPrincipal';

const ModalPlayer = ({ isVisible, handlePressButtonAdd, setModalVisible,handleEditPlayer,pressButtonAdd, setModalVisibleAdd, players }) => {

    const _renderItem = ({ item, index }) =>
    (
        <TouchableOpacity onPress={()=>handleEditPlayer(item)} style={styles.player} key={index}>
            <Text style={styles.textPlayer}>{item.name}</Text>
        </TouchableOpacity>
    )

    return (
        <Modal
            propagateSwipe={true}
            backdropOpacity={0.35}
            animationInTiming={1}
            animationOutTiming={1}
            onModalHide={
                () => {
                    if (pressButtonAdd) {
                        setModalVisibleAdd(true)
                    }
                }
            }
            onBackdropPress={() => setModalVisible(false)}
            isVisible={isVisible}
            style={{ justifyContent: 'flex-end', margin: 0 }}
        >
            <View style={styles.containerRootModal}>
                <Text style={styles.title}>Selecciona tu jugador</Text>
                {
                    players.length === 0 &&
                    <>
                        <Empty/>
                        <Text style={{color:colors.black}} >Sin jugadores</Text>
                    </>
                }
                <FlatList
                    contentContainerStyle={{ paddingBottom: 60}}
                    style={{ width: '100%', paddingHorizontal: 30 }}
                    data={players}
                    renderItem={_renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
                <View style={{ position: 'absolute', bottom: 10 }}>
                    <ButtonPrincipal width={250} text={'Añadir jugador'} action={handlePressButtonAdd} />
                </View>
            </View>
        </Modal>
    )
}

export default ModalPlayer

const styles = StyleSheet.create({
    containerRootModal: {
        backgroundColor: colors.white,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        height: '50%',
        alignItems: 'center',
        paddingTop: 25,
        paddingBottom:100,
    },
    title: {
        marginBottom: 20,
        fontSize: 18,
        color:colors.black 
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 7.5,
        position: 'absolute',
        bottom: 50
    },
    textButton: {
        color: colors.white
    },
    player:{
        alignItems:'center',
        paddingVertical:12,
        borderWidth:0.2,
        borderColor:colors.primary,
        marginVertical:10,
        borderRadius:5
    },
    textPlayer:{
       fontWeight:'600',
       fontSize:17,
       color:colors.black 
    }
})