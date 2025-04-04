import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableWithoutFeedback, Share } from 'react-native';
import { IconButton, Drawer } from 'react-native-paper';
import { RootStackParamList } from '@/types/navigation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { GetMessages, GetPoolInfo, PostLeavePool } from '@/services/serviceControllers';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { io } from 'socket.io-client';
import { IMessage } from '@/types/message';
import { getSessionInfo } from '@/utilities/sessionsHandler';
import { WEBSOCKET_URL } from '@/services/endPoints';
import { decryptMessage } from '@/utilities/encryption';
import NotificationPill from '@/components/NotificationPill';
import Clipboard from '@react-native-clipboard/clipboard';

type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>;
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

export default function ChatScreen() {
    const route = useRoute<ChatScreenRouteProp>();
    const { poolId, encryptionKey } = route.params;
    const navigation = useNavigation<ChatScreenNavigationProp>();
    const senderAlias = getSessionInfo()?.alias;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [participants, setParticipants] = useState<string[]>([]);
    const [socket, setSocket] = useState<any>(null);
    const [isTyping, setIsTyping] = useState({ status: false, alias: '' });
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [notifications, setNotifications] = useState<string | null>(null);
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

        newSocket.on('notification', (notificationEvent) => {
            setNotifications(notificationEvent);
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
    const getPoolInfoApiCall = async () => {
        try {
            const response = await GetPoolInfo(poolId);
            if (response) {
                setParticipants(response.participants);
            }
        } catch (error) {
            console.error('Failed to get pool info', error);
        }
    };

    // Websocket Event Emmitters
    const pushJoinPoolEventToSocket = (socketInstance: any) => {
        if (socketInstance) {
            socketInstance.emit('join', { poolId, senderAlias });
        }
    };
    const pushLeavePoolEventToSocket = () => {
        if (socket) {
            socket.emit('leave', { poolId, senderAlias });
        }
    };
    const pushLeavePoolQuietlyEventToSocket = () => {
        if (socket) {
            socket.emit('leave_quietly', { poolId, senderAlias });
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
            pushLeavePoolEventToSocket();
        } else {
            navigation.navigate('Error', { message: 'Failed to leave pool. Please try again!' });
        }
    };
    const handleLeavePoolQuietly = async () => {
        const response = await leavePoolApiCall();
        if (response) {
            navigation.navigate('Home');
            pushLeavePoolQuietlyEventToSocket();
        } else {
            navigation.navigate('Error', { message: 'Failed to leave pool. Please try again!' });
        }
    };
    const handleCopyPoolId = () => {
        setDrawerVisible(false);
        Clipboard.setString(poolId);
        setNotifications('Pool ID copied to clipboard.');
    };
    const handleSharePoolId = async () => {
        setDrawerVisible(false);
        Share.share({ message: `Join my pool on SilentPool! Use this Pool ID: ${poolId}` });
    };

    useEffect(() => {
        getMessagesApiCall();
        const interval = setInterval(() => {
            getPoolInfoApiCall();
        }, 15000);
        return () => clearInterval(interval);
    }, []);
    return (
        <View style={styles.container}>
            {/* Drawer */}
            {drawerVisible && (
                <TouchableWithoutFeedback onPress={() => setDrawerVisible(false)}>
                    <View style={styles.overlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.drawerContainer}>
                                <Drawer.Section title="Chat Options">
                                    <Drawer.Item
                                        label="Copy Pool Id"
                                        icon="content-copy"
                                        onPress={handleCopyPoolId}
                                    />
                                    <Drawer.Item
                                        label="Share Pool Id"
                                        icon="share"
                                        onPress={handleSharePoolId}
                                    />
                                    <Drawer.Item
                                        label="Leave Pool"
                                        icon="exit-to-app"
                                        onPress={handleLeavePool}
                                    />
                                    <Drawer.Item
                                        label="Leave Quietly"
                                        icon="ghost"
                                        onPress={handleLeavePoolQuietly}
                                    />
                                </Drawer.Section>
                                <Drawer.Section title="Participants">
                                    <FlatList
                                        data={participants}
                                        renderItem={({ item }) => {
                                            return (
                                                <View style={styles.participantContainer}>
                                                    <Text style={styles.participantName}>{item}</Text>
                                                    <IconButton icon="circle" size={10} iconColor='green' />
                                                </View>
                                            );
                                        }}
                                        keyExtractor={(_, index) => index.toString()}
                                        style={styles.participantsContainer}
                                    />
                                </Drawer.Section>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            )}

            {/* Chat Screen Header with Drawer Button */}
            <View style={styles.header}>
                <IconButton
                    icon="menu"
                    iconColor="#fff"
                    size={20}
                    onPress={() => setDrawerVisible(!drawerVisible)}
                />
                <Text style={styles.headerText}>Pool {poolId}</Text>
            </View>

            {/* Chat Messages */}
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

            {/* Notification Indicator */}
            {notifications && (
                <NotificationPill message={notifications} onDismiss={() => setNotifications(null)} />
            )}

            {/* Typing Indicator */}
            {isTyping.status && (
                <Text style={styles.typingIndicator}>{isTyping.alias} is typing...</Text>
            )}

            {/* Input Field */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Type your message...'
                    value={message}
                    onChangeText={handleMessageChange}
                />
                <IconButton icon='send' onPress={handleSendMessage} iconColor='#00DDEC' />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#151718',
    },
    drawerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '70%',
        height: '100%',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.1,
        elevation: 10,
        zIndex: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 1,
    },
    participantsContainer: {
        flex: 1,
        maxHeight: 300,
        minHeight: 100,
        paddingHorizontal: 10,
    },
    participantContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
    },
    participantName: {
        fontSize: 13,
        color: 'green',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 50,
        paddingVertical: 10,
        paddingRight: 10,
        backgroundColor: '#00DDEC',
    },
    headerText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
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
        maxWidth: '90%',
    },
    senderName: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold',
    },
    message: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'medium',
    },
    leftMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#3A3C3D',
    },
    rightMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#00C4D2',
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
        color: '#fff',
        backgroundColor: '#555',
        marginRight: 5,
    },
});
