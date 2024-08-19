import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from "react";

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

interface TagProps {
    listTitle: string;
    taskItems: TaskItem[];
    color: string[];
}

// Define the navigation parameter list
type RootStackParamList = {
    Detail: { listTitle: string; taskItems: TaskItem[] };
    Home: { listTitle: string; taskItems: TaskItem[] };
};

//////////////MAIN COMPONENT
const Tag = ({listTitle, taskItems, color}: TagProps) => { 
    const [remainingCount, setRemainingCount] = useState(taskItems.filter(item => !item.done).length);
    const [completedCount, setCompletedCount] = useState(taskItems.filter(item => item.done).length);

    // useEffect
    useEffect(() => {
        // console.log("Task Items Updated:", JSON.stringify(taskItems, undefined, 2));
        setRemainingCount(taskItems.filter(item => !item.done).length);
        setCompletedCount(taskItems.filter(item => item.done).length);
    });

    // Use typed navigation
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <TouchableOpacity 
        style={styles.container} 
        onPress={() => navigation.navigate('Detail', { listTitle: listTitle, taskItems: taskItems })}
        >
        <LinearGradient colors={color} style={styles.tag}>
            <Text style={styles.title}>{listTitle}</Text>
            <Text style={styles.subtitle}>Remaining</Text>
            <Text style={styles.number}>{remainingCount}</Text>
            <Text style={styles.subtitle}>Completed</Text>
            <Text style={styles.number}>{completedCount}</Text>
        </LinearGradient>
        </TouchableOpacity>
    );
};

export default Tag;

const SPACING = 20;
const TAG_SIZE = 250;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  tag: {
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    width: TAG_SIZE,
    margin: SPACING,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 40,
    color: '#ECDFCC',
    width: '100%', // Ensure the title takes full width of its container
    height: 120,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  subtitle: {
    width: '100%',
    fontFamily: 'Roboto-Thin',
    fontSize: 20,
    color: '#ECDFCC',
    textAlign: 'center',
  },
  number: {
    width: '100%',
    fontFamily: 'Roboto-Thin',
    fontSize: 70,
    color: '#ECDFCC',
    textAlign: 'center',
  },
});
