import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {colors} from "../../colors";

type ModalComponentProps = {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    addNewList: (title: string, color: string) => void; // Function to add new list
  };

const ModalComponent = ({modalVisible, setModalVisible, addNewList}: ModalComponentProps) => {
    const [text, setText] = useState('');    
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    // console.log('selectedColor:', selectedColor);
    

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
    };

    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* MODAL TITLE */}
            <Text style={styles.modalTitle}>CREATE NEW LIST</Text>
            {/* MODAL INPUT */}
            <TextInput 
                style={styles.modalTextInput} 
                placeholder="Typing list name...." 
                textAlign='center'
                onChangeText={newText => setText(newText)}
                defaultValue={text}
            />
            {/* CHOOSE LIST COLOR */}
            <View style={styles.modalColorContainer}>
                <Text style={styles.modalColorText}>Choose color</Text>
                <View style={styles.modalColorButtonsContainer}>
                        {Object.entries(colors).map(([key, colorGradient]) => (
                            <Pressable
                                key={key}
                                onPress={() => handleColorSelect(key)}
                                style={[
                                    styles.modalColorButton,
                                    selectedColor === key && { 
                                        // Zoom Effect Smooth
                                        transform: [
                                            {scale: selectedColor === key? 1.3 : 1}
                                        ]  // End Zoom Effect
                                    } 
                                ]}
                            >
                                <LinearGradient
                                    colors={colorGradient}
                                    style={styles.modalColorButton}
                                />
                            </Pressable>
                        ))}
                </View>
            </View>
            {/* MODAL BUTTONS */}
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, styles.buttonClose]}
                onPress={() => {
                        setModalVisible(!modalVisible)
                        setText('')
                        selectedColor && setSelectedColor(null)
                    }
                }>
                <Ionicons name='close' size={30} color='#ECDFCC'/>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.buttonClose]}
                onPress={() => {
                    if (text.trim().length > 0 && selectedColor) {
                        addNewList(text, selectedColor);
                        Alert.alert('List created successfully:', text);
                      } else if (text.trim().length === 0) {
                        Alert.alert('Error', 'List name cannot be empty.');
                      } else {
                        Alert.alert('Error', 'Please select a color.');
                      }
                      setModalVisible(!modalVisible);
                      setText('');
                      selectedColor && setSelectedColor(null)
                }}>
                <Ionicons name='checkmark' size={30} color='#ECDFCC'/>
              </Pressable>
            </View>
            
          </View>
        </View>
      </Modal>
    )
}



export default memo(ModalComponent);




const check = {
    borderColor: 'red',
    borderWidth: 2,
  };
  
const styles = StyleSheet.create({
    // FOR MODAL
  centeredView: {
    // ...check,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    // ...check,
    height: 400,
    width: 370,
    margin: 20,
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
    width: '100%', // Ensure the title takes full width of its container
    textAlign: 'center',
  },
  modalTextInput: {
    height: 70,
    width: 250,
    borderColor: '#ECDFCC',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 40,
    paddingVertical: 10,
    color: '#ECDFCC',
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
    //   FOR MODAL COLOR
  modalColorContainer: {
    // ...check,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  modalColorText: {
    // ...check,
    fontFamily: 'NewAmsterdam-Regular',
    fontSize: 28,
    color: '#ECDFCC',
    marginBottom: 10,
  },
  modalColorButtonsContainer: {
    // ...check,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalColorButton: {
    // ...check,
    width: 30,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    elevation: 2,
  },
  modalButtonContainer: {
    // ...check,
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