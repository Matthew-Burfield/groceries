import {
  View,
  Text,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

// https://github.com/WrathChaos/react-native-bouncy-checkbox/tree/master

export interface CheckboxProps {
  text: string;
  isChecked: boolean;
  onPress: (event: GestureResponderEvent) => Promise<boolean>;
}

export function Checkbox(props: CheckboxProps) {
  return (
    <Pressable onPress={props.onPress} style={styles.container}>
      <CheckboxIcon isChecked={props.isChecked} />
      <CheckboxText text={props.text} />
    </Pressable>
  );
}

type CheckboxIconProps = { isChecked: boolean };
function CheckboxIcon(props: CheckboxIconProps) {
  return (
    <View>
      {props.isChecked ? (
        <AntDesign name="checksquare" size={24} color="black" />
      ) : (
        <View style={styles.unchecked} />
      )}
    </View>
  );
}

type CheckboxTextProps = { text: string };
function CheckboxText(props: CheckboxTextProps) {
  return (
    <View>
      <Text>{props.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  unchecked: {
    margin: 2,
    height: 20,
    width: 20,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 2,
  },
});

export default Checkbox;
