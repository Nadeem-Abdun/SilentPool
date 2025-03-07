import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { Button, Menu } from 'react-native-paper';
import { RootStackParamList } from '@/types/navigation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { GetMessages, PostLeavePool } from '@/services/serviceControllers';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { io } from 'socket.io-client';
import { IMessage } from '@/types/message';
import { getSessionInfo } from '@/utilities/sessionsHandler';
import { WEBSOCKET_URL } from '@/services/endPoints';
import { decryptMessage } from '@/utilities/encryption';

type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>;
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

export default function ChatScreen() {
    const route = useRoute<ChatScreenRouteProp>();
    const { poolId, encryptionKey } = route.params;
    const navigation = useNavigation<ChatScreenNavigationProp>();
    const senderAlias = getSessionInfo()?.alias;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [socket, setSocket] = useState<any>(null);
    const [isTyping, setIsTyping] = useState({
        status: false,
        alias: ''
    });
    const [menuVisible, setMenuVisible] = useState(false);
    let typingTimeout: NodeJS.Timeout | null = null;

    // Websocket Initialization
    useEffect(() => {
        const newSocket = io(WEBSOCKET_URL.BASE_URL, {
            transports: ['websocket'],
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to Socket.io');
            pushJoinPoolEventToSocket(newSocket);
        });

        newSocket.on('message', (newMessage: IMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            console.log('Received message:', newMessage);
        });

        newSocket.on('typing', (typingEvent) => {
            setIsTyping({
                status: true,
                alias: typingEvent.senderAlias
            });
            // Reset the typing timeout
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            typingTimeout = setTimeout(() => {
                setIsTyping({ status: false, alias: '' });
            }, 3000);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from Socket.io');
        });

        return () => {
            newSocket.disconnect();
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, []);

    // API Calls
    const getMessagesApiCall = async () => {
        try {
            const response = await GetMessages(poolId);
            if (response) {
                setMessages(response);
            }
        } catch (error) {
            console.error('Failed to get messages', error);
        }
    };
    const leavePoolApiCall = async () => {
        try {
            const formdata = { poolId };
            const response = await PostLeavePool(formdata);
            if (response) {
                console.log('Left Pool With ID:', poolId);
            }
            return response;
        } catch (error) {
            console.error('Failed to leave pool', error);
        }
    };

    // Websocket Event Emmitters
    const pushJoinPoolEventToSocket = (socketInstance: any) => {
        if (socketInstance) {
            socketInstance.emit('join', { poolId, senderAlias });
        }
    };
    const pushMessageEventToSocket = () => {
        if (socket) {
            socket.emit('message', { poolId, senderAlias, content: message });
            setMessage('');
        } else {
            console.error('Socket.io is not connected.');
        }
    };
    const pushTypingEventToSocket = () => {
        if (socket) {
            socket.emit('typing', { poolId, senderAlias });
        }
    };

    // Onchange Functions
    const handleMessageChange = (e: string) => {
        setMessage(e);
        pushTypingEventToSocket();
    };

    // Submit Functions
    const handleSendMessage = () => {
        if (message.trim() === '') {
            alert('Message cannot be empty');
            return;
        }
        pushMessageEventToSocket();
    };
    const handleLeavePool = async () => {
        const response = await leavePoolApiCall();
        if (response) {
            navigation.navigate('Home');
        } else {
            navigation.navigate('Error', { message: 'Failed to leave pool. Please try again!' });
        }
    };

    useEffect(() => {
        getMessagesApiCall();
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Pool ID: {poolId}</Text>
                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <Button icon="dots-vertical" onPress={() => setMenuVisible(true)} children={undefined} style={styles.menuButton} />
                    }
                    mode='elevated'
                    style={styles.menuContent}
                >
                    <Menu.Item onPress={() => handleLeavePool} title="Leave" />
                </Menu>
            </View>
            <FlatList
                data={messages}
                renderItem={({ item }) => {
                    const isCurrentUser = item.senderAlias === senderAlias;
                    return (
                        <View
                            style={[
                                styles.messageContainer,
                                isCurrentUser ? styles.rightMessage : styles.leftMessage,
                            ]}
                        >
                            <Text style={styles.senderName}>{item.senderAlias}</Text>
                            <Text style={styles.message}>
                                {decryptMessage(item.content, encryptionKey)}
                            </Text>
                        </View>
                    );
                }}
                keyExtractor={(_, index) => index.toString()}
                style={styles.chatLog}
            />
            {isTyping.status && (
                <Text style={styles.typingIndicator}>{isTyping.alias} is typing...</Text>
            )}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Type your message...'
                    value={message}
                    onChangeText={handleMessageChange}
                />
                <Button icon='send' onPress={handleSendMessage} mode='text' contentStyle={{ flexDirection: 'row-reverse' }}>Send</Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        padding: 10,
        backgroundColor: '#007AFF',
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    menuContent: {
        padding: 0,
        margin: 0,
    },
    menuButton: {        
        alignSelf: 'flex-end',
    },
    chatLog: {
        flex: 1,
        padding: 10,
    },
    messageContainer: {
        marginBottom: 10,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#eaeaea',
        maxWidth: '90%',
    },
    senderName: {
        fontSize: 12,
        color: '#900',
        fontWeight: 'bold',
    },
    message: {
        fontSize: 16,
    },
    leftMessage: {
        alignSelf: 'flex-start',
    },
    rightMessage: {
        alignSelf: 'flex-end',
    },
    typingIndicator: {
        fontSize: 14,
        color: '#888',
        paddingLeft: 10,
        paddingVertical: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        marginRight: 5,
    },
});
