import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback, ScrollView } from 'react-native';
import SideMenu from 'react-native-side-menu';

export default class RoutesMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            routes: this.props.routes,
        };          
    }

    handleRouteSelect = () => {
        const route = 'asd';
        this.props.onRouteSelect(route);
    }

    renderMenuIndicator() {
        return(
            <TouchableNativeFeedback>
                <View style={styles.menuIndicator}>

                </View>
            </TouchableNativeFeedback>
        )
    }

    render() {
        return(
            <SideMenu>
                <View style={styles.container}>
                    {this.renderMenuIndicator()}
                    <Text>Asd asd asd asd</Text>
                    <Text>Asd asd asd asd</Text>
                    <Text>Asd asd asd asd</Text>
                    <Text>Asd asd asd asd</Text>
                    <Text>Asd asd asd asd</Text>
                    <Text>Asd asd asd asd</Text>
                    <Text>Asd asd asd asd</Text>
                    <Text>Asd asd asd asd</Text>
                    <Text>Asd asd asd asd</Text>
                </View>
            </SideMenu>
        )
    }
}

const styles = StyleSheet.create({
    container: {        
        backgroundColor: '#F5FCFF',
    },
    menuIndicator: {
        width: 100,
        height: 100,
        borderRadius: 90,
        backgroundColor: '#993955'
    },
    buttonWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0
    },
    recordButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 45,
        borderWidth: 5,        
    },
    recordButtonInactive: {
        borderColor: '#993955',
        backgroundColor: '#E9ECF5',
    },
    recordButtonActive: {
        backgroundColor: '#993955',
        borderColor: '#1D201F',
    },
    recordButtonText: {
        color: '#1D201F',
        fontSize: 24,
    }
});