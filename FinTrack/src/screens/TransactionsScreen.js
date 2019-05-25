import React from 'react'
import { 
    Stylesheet, 
    Text, 
    View, 
} from 'react-native'

export default class TransactionsScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Transactions</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor = '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 30,
    },
})