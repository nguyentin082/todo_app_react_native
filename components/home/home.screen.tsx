import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import Tag from './tag';
import { backgroundColor } from '../../colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../colors';
import ModalComponent from './modal';
import DeleteModal from './delete.modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

// CONSTANTS
const ITEM_SIZE = 250 + 20 * 2; // Width of each item plus margins
const { width } = Dimensions.get('window');
const SPACE_ITEM_SIZE = (width - ITEM_SIZE) / 2;

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

type RootStackParamList = {
  Detail: { listTitle: string; taskItems: TaskItem[] };
  Home: { listTitle: string; taskItems: TaskItem[] };
};

// FUNCTIONS
const addSpacersAndReversedTasks = (tasks: Task[]) => [
  { id: -1, title: 'spacer-start', color: '', items: [] }, // Spacer at start
  ...tasks,
  { id: -2, title: 'spacer-end', color: '', items: [] }, // Spacer at end
].reverse();

const saveTasksToLocalStorage = async (tasks: Task[]) => {
  try {
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks', error);
  }
};

const loadTasksFromLocalStorage = async () => {
  try {
    const tasksString = await AsyncStorage.getItem('tasks');
    if (tasksString) {
      return JSON.parse(tasksString);
    }
    return [];
  } catch (error) {
    console.error('Error loading tasks', error);
    return [];
  }
};

///////// MAIN COMPONENT
const HomeScreen = ({ navigation }: { navigation: NavigationProp<RootStackParamList> }) => {
  const route = useRoute<RouteProp<RootStackParamList, 'Home'>>();

  // HOOKS
  const [loadedLists, setLoadedLists] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Load tasks from local storage when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      const storedTasks = await loadTasksFromLocalStorage();
      setLoadedLists(storedTasks);
    };
    fetchTasks();
  }, []);

  // Update the task list whenever route params change
  useFocusEffect(
    useCallback(() => {
      if (route.params) {
        const { listTitle: updateListTitle, taskItems: updatedTaskItems } = route.params;

        // Find and replace list name that matches title with updatedTaskItems
        setLoadedLists((prevLoadedLists) => {
          const listIndex = prevLoadedLists.findIndex((list) => list.title === updateListTitle);
          if (listIndex > -1) {
            const newLists = [...prevLoadedLists];
            newLists[listIndex] = { ...newLists[listIndex], items: updatedTaskItems };
            return newLists;
          } else {
            console.error(`List with title "${updateListTitle}" not found.`);
            return prevLoadedLists;
          }
        });
      }
    }, [route.params])
  );

  // Save tasks to local storage whenever loadedLists changes
  useEffect(() => {
    saveTasksToLocalStorage(loadedLists);
  }, [loadedLists]);

  // FUNCTION TO ADD NEW LIST
  const addNewList = useCallback(
    (title: string, color: string) => {
      if (title.trim().length === 0) {
        Alert.alert('Error', 'List name cannot be empty.');
        return;
      } else if (loadedLists.find((list) => list.title === title)) {
        Alert.alert('Error', 'List name already exists.');
        return;
      } else if (color.trim().length === 0) {
        Alert.alert('Error', 'Color cannot be empty.');
        return;
      } else {
        const newList: Task = {
          id: Date.now(),
          title: title,
          items: [],
          color: color,
        };
        setLoadedLists((prevTasks) => [...prevTasks, newList]);
      }
    },
    [loadedLists]
  );

  const processedLists = useMemo(() => addSpacersAndReversedTasks(loadedLists), [loadedLists]);
  // console.log('processedLists:', JSON.stringify(processedLists, undefined, 2));
  

  return (
    <View style={styles.container}>
      {/* APP TITLE */}
      <View style={styles.titleContainer}>
        <Text style={styles.titlePart1}>TODO</Text>
        <Text style={styles.titlePart2}>lists</Text>
      </View>
      {/* LIST */}
      <View style={styles.flatListContainer}>
        <FlatList
          data={processedLists}
          renderItem={({ item, index }) => {
            if (item.title.startsWith('spacer')) {
              return <View key={index} style={{ width: SPACE_ITEM_SIZE, height: 100 }} />;
            } else {
              return (
                <Animated.View style={styles.itemWrapper} key={item.id.toString()}>
                  <View style={styles.tagContainer}>
                    <Tag
                      key={item.id}
                      listTitle={item.title}
                      color={colors[item.color]}
                      taskItems={item.items}
                    />
                  </View>
                </Animated.View>
              );
            }
          }}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_SIZE}
          decelerationRate="fast"
          bounces={false}
          contentContainerStyle={styles.contentContainerStyle}
        />
      </View>
      {/* BUTTONS */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>
            <Ionicons name="add" size={30} color="#3C3D37" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setDeleteModalVisible(true)}>
          <Text style={styles.buttonText}>
            <Ionicons name="trash" size={30} color="#3C3D37" />
          </Text>
        </TouchableOpacity>
      </View>
      {/* Modal */}
      <ModalComponent 
        modalVisible={modalVisible} 
        setModalVisible={setModalVisible} 
        addNewList={addNewList} 
      />
      <DeleteModal 
        deleteModalVisible={deleteModalVisible} 
        setDeleteModalVisible={setDeleteModalVisible} 
        loadedLists={loadedLists}
        setLoadedLists={setLoadedLists}
      />
    </View>
  );
};

export default HomeScreen;

const check = {
  borderWidth: 1,
  borderColor: 'red',
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: backgroundColor,
    alignItems: 'center',
    flex: 1,
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  titlePart1: {
    fontFamily: 'NewAmsterdam-Regular',
    fontSize: 120,
    color: '#3C3D37',
  },
  titlePart2: {
    fontFamily: 'Roboto-Thin',
    fontSize: 25,
    paddingLeft: 5,
    color: '#3C3D37',
  },
  flatListContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  contentContainerStyle: {
    alignItems: 'center',
  },
  itemWrapper: {
    // ...check,
    width: ITEM_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagContainer: {
    // ...check,
    width: ITEM_SIZE,
    alignItems: 'center',
  },
  buttonContainer: {
    // ...check,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    // ...check,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECDFCC',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#3C3D37',
    flex: 1,
    height: 60,
    marginHorizontal: 50,
    padding: 10,
  },
  buttonText: {
    fontFamily: 'NewAmsterdam-Regular',
    fontSize: 18,
    color: '#3C3D37',
  },
});
