import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    topContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    table: {
        flexGrow: 1,
        borderWidth: 1,
        borderColor: 'white',
    },
    tableRow: {
        flexDirection: 'row',
    },
    smallButton: {
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