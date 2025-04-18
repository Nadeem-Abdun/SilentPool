import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Portal, Modal, Button, Icon } from 'react-native-paper';

interface PopUpProps {
    message: string;
    type?: string;
    openPopUp: boolean;
    setOpenPopUp: React.Dispatch<React.SetStateAction<{ status: boolean; message: string; type: string; }>>;
}

const PopUp: React.FC<PopUpProps> = ({ message, type, openPopUp, setOpenPopUp }) => {
    return (
        <Portal>
            <Modal
                visible={openPopUp}
                onDismiss={() => setOpenPopUp({ status: false, message: "", type: "" })}
                contentContainerStyle={styles.container}
            >
                <View style={styles.content}>
                    {type === "info" && <Icon source="information-outline" size={40} color="#4CAF50" />}
                    {type === "error" && <Icon source="alert-circle-outline" size={40} color="#D32F2F" />}
                    <Text style={styles.message}>{message}</Text>
                    <Button mode="contained" onPress={() => setOpenPopUp({ status: false, message: "", type: "" })}>Close</Button>
                </View>
            </Modal>
        </Portal >
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 25,
        marginHorizontal: 20,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    message: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    }
});

export default PopUp