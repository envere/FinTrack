import React from 'react'
import { 
    Stylesheet, 
    Text, 
    View 
} from 'react-native'

export default class SettingsScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Settings</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create {
    container: {
        flex: 1,
        backgroundColor = '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 30,
    },
}