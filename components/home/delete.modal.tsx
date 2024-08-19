import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from '../detail/checkbox';

// TYPES
type TaskItem = {
    id: number;
    title: string;
    done: boolean;
};

type Task = {
    id: number;
    title: string;
    color: string;
    items: TaskItem[];
};

interface DeleteModalProps {
    deleteModalVisible: boolean;
    setDeleteModalVisible: (visible: boolean) => void;
    loadedLists: Task[];
    setLoadedLists: (tasks: Task[]) => void;
}

export default function DeleteModal({ deleteModalVisible, setDeleteModalVisible, loadedLists, setLoadedLists }: DeleteModalProps) {
    // HOOKS
    const [checkedItems, setCheckedItems] = useState<number[]>([]);

    // Toggle task selection
    const toggleCheckbox = (index: number) => {
        setCheckedItems((prev) => {
            if (prev.includes(index)) {
                return prev.filter((item) => item !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    // Handle delete action
    const handleDelete = () => {
        const updatedLists = loadedLists.filter((_, index) => !checkedItems.includes(index));
        setLoadedLists(updatedLists);
        setDeleteModalVisible(false);
    };

    const listsName = loadedLists.map(list => list.title);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={deleteModalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setDeleteModalVisible(!deleteModalVisible);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {/* MODAL TITLE */}
                    <Text style={styles.modalTitle}>CHOOSE TO DELETE</Text>
                    {/* MODAL FLAT LIST */}
                    <FlatList 
                        style={styles.flatList}
                        data={[...listsName].reverse()}  // Reverse the data array
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <Pressable onPress={() => toggleCheckbox(listsName.length - 1 - index)} style={styles.checkboxItem}>
                                <Checkbox
                                    checked={checkedItems.includes(listsName.length - 1 - index)}
                                    onChange={() => toggleCheckbox(listsName.length - 1 - index)}
                                />
                                <Text style={styles.itemText}>{item}</Text>
                            </Pressable>
                        )}
                    />
                    {/* MODAL BUTTONS */}
                    <View style={styles.modalButtonContainer}>
                        <Pressable
                            style={[styles.modalButton, styles.buttonClose]}
                            onPress={() => 
                                {
                                    setDeleteModalVisible(false)
                                    setCheckedItems([])
                                }
                            }>
                            <Ionicons name='close' size={30} color='#ECDFCC' />
                        </Pressable>
                        <Pressable
                            style={[styles.modalButton, styles.buttonClose]}
                            onPress={() => 
                                {
                                    handleDelete();
                                    setCheckedItems([])
                                }
                            }>
                            <Ionicons name='checkmark' size={30} color='#ECDFCC' />
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const check = {
    borderColor: 'red',
    borderWidth: 2,
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        // ...check,
        height: 400,
        width: 370,
        backgroundColor: '#697565',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: 'space-around',
    },
    modalTitle: {
        // ...check,
        fontFamily: 'NewAmsterdam-Regular',
        fontSize: 50,
        color: '#ECDFCC',
        width: '100%',
        textAlign: 'center',
        marginBottom: 10,
    },
    flatList: {
        // ...check,
        width: '100%',
        flex: 1,
        marginBottom: 20,
    },
    checkboxItem: {
        // ...check,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    itemText: {
        // ...check,
        fontSize: 18,
        color: '#ECDFCC',
        marginLeft: 10,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
    },
    modalButton: {
        borderRadius: 13,
        padding: 10,
        elevation: 2,
        marginHorizontal: 20,
    },
    buttonClose: {
        backgroundColor: '#3C3D37',
    },
});
