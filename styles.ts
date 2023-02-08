import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    topContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    table: {
        flexGrow: 1,
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: 'white',
    },
    tableRow: {
        flex: 0,
        flexDirection: 'row',
        paddingHorizontal: 5,
        borderWidth: 3,
        borderRadius: 10,
    },
    textInput: {
        flexShrink: 1,
    },
    smallButton: {
        flex: 0,
        height: 50,
        width: 50,
        paddingTop: 5,
        paddingLeft: 5,
    },
    footer: {
        flex: 0,
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
        paddingVertical: 10,
    }
  });