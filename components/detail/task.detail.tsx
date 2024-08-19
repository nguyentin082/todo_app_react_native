import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Checkbox from "./checkbox";
import { useCallback, useState } from "react";
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";

type TaskItem = {
  id: number;
  title: string;
  done: boolean;
};

type RootStackParamList = {
  Detail: { listTitle: string; taskItems: TaskItem[] };
  Home: { listTitle: string; taskItems: TaskItem[] };
};

const DetailScreen = ({ navigation }: { navigation: NavigationProp<RootStackParamList> }) => {
    const route = useRoute<RouteProp<RootStackParamList, "Detail">>();
    const { listTitle, taskItems } = route.params;

    // HOOKS
    const [allTasks, setAllTasks] = useState<TaskItem[]>(taskItems);
    const [checkedItems, setCheckedItems] = useState<boolean[]>(taskItems.map((item) => item.done));
    const [isEditing, setIsEditing] = useState<number | null>(null); // Track which task is being edited
    const [value, setValue] = useState('');
    
    // FUNCTIONS
    const handleCheckboxChange = (index: number) => {
        const updatedCheckedItems = [...checkedItems];
        updatedCheckedItems[index] = !updatedCheckedItems[index];
        setCheckedItems(updatedCheckedItems);

        const updatedTasks = [...allTasks];
        updatedTasks[index].done = updatedCheckedItems[index];
        setAllTasks(updatedTasks);
    };

    const handleSaveTask = (index: number) => {
        const updatedTasks = [...allTasks];
        updatedTasks[index].title = value.trim(); // Save trimmed title
        setAllTasks(updatedTasks);
        setIsEditing(null);
        setValue('');
    };

    const addNewTask = () => {
        const newTask: TaskItem = {
        id: Date.now(),
        title: '',
        done: false,
        };
        setAllTasks((prevTasks) => [...prevTasks, newTask]);
        setCheckedItems((prevChecked) => [...prevChecked, false]);
        setIsEditing(allTasks.length); // Set the new task to be in editing mode
        setValue(''); // Ensure the value is reset
    };

    const saveAndGoHome = () => {
        // console.log('allTasks', JSON.stringify(allTasks, undefined, 2));
        
        // Go to the home screen
        navigation.navigate('Home', { listTitle: listTitle, taskItems: allTasks });
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>{listTitle}</Text>
        <View style={styles.taskItem}>
            {allTasks.map((item, index) => (
            <View style={styles.eachItem} key={item.id}>
                <Checkbox
                    checked={checkedItems[index]}
                    onChange={() => handleCheckboxChange(index)}
                />
                {isEditing === index ? (
                <TextInput
                    value={value}
                    onChangeText={(value) => setValue(value)}
                    autoFocus
                    onBlur={() => handleSaveTask(index)}
                    onSubmitEditing={() => handleSaveTask(index)}
                    style={styles.taskItemInput}
                />
                ) : (
                <Text
                    style={[
                        styles.taskItemContent,
                        checkedItems[index] ? styles.textLineThrough : {}
                    ]}
                    onPress={() => {
                        setIsEditing(index);
                        setValue(item.title);
                    }}
                >
                    {item.title}
                </Text>
                )}
                <Ionicons
                name="trash"
                size={30}
                color="#3C3D37"
                onPress={() => {
                    const updatedTasks = allTasks.filter((_, i) => i !== index);
                    setAllTasks(updatedTasks);
                    const updatedCheckedItems = checkedItems.filter((_, i) => i !== index);
                    setCheckedItems(updatedCheckedItems);
                    // console.log(JSON.stringify(allTasks, undefined, 2));
                }}
                />
            </View>
            ))}
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={addNewTask}>
            <Text style={styles.buttonText}>
                <Ionicons name="add-circle" size={30} color="#3C3D37" />
            </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => {saveAndGoHome()}}>
            <Text style={styles.buttonText}>
                <Ionicons name="save" size={30} color="#3C3D37" />
            </Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

export default DetailScreen;

const SPACE = 20;
const check = {
    borderWidth: 2,
    borderColor: 'red',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECDFCC',
  },
  title: {
    width: '100%',
    fontFamily: 'Roboto-Bold',
    fontSize: 40,
    color: '#1E201E',
    textAlign: 'center',
  },
  taskItem: {
    // ...check,
    width: '100%',
    paddingHorizontal: 60,
    paddingVertical: 10,
  },
  eachItem: {
    // ...check,
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  taskItemContent: {
    // ...check,
    fontFamily: 'Roboto-Thin',
    fontSize: 20,
    color: '#1E201E',
    textAlign: 'left',
    marginHorizontal: 20,
    flex: 1,
  },
  taskItemInput: {
    // ...check,
    fontFamily: 'Roboto-Thin',
    fontSize: 20,
    color: '#1E201E',
    marginHorizontal: 20,
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#1E201E',
  },
  textLineThrough: {
    textDecorationLine: 'line-through',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: SPACE,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECDFCC',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#3C3D37',
    flex: 1,
    marginHorizontal: 50,
    height: 60,
  },
  buttonText: {
    fontFamily: 'Roboto-Light',
    color: '#3C3D37',
    fontSize: 20,
    paddingVertical: 15,
  },
});
