import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback, ScrollView } from 'react-native';

export default class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            routes: this.props.routes,
            renderedRoutes: null,
        };          
    }

    handleRouteSelect = (route) => {
        this.props.onRouteSelect(route);
    }

    renderRoutes() {
        let routes = this.props.routes;

        if (routes) {
            return routes.map((route, i) => {
                return (
                    <TouchableNativeFeedback 
                    background={TouchableNativeFeedback.SelectableBackground()} 
                    key={i} 
                    onPress={() => this.handleRouteSelect(routes[i])}>
                        <View style={styles.menuItem}>
                            <Text style={styles.menuItemText}>{route.name}</Text>
                        </View>                        
                    </TouchableNativeFeedback>
                );
            });
        } else {
            return (
                <Text>You have no saved routes.</Text>
            );
        }
    }

    render() {
        const title = 'Saved Routes';

        return(
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>{title.toUpperCase()}</Text>                    
                </View>
                <ScrollView style={styles.routesList}>
                    {this.renderRoutes()}
                </ScrollView>
            </View>            
        )
    }
}

const styles = StyleSheet.create({
    container: {     
        ...StyleSheet.absoluteFillObject,   
        backgroundColor: '#E9ECF5',
        borderColor: '#993955',
        borderRightWidth: 5,
    },
    title: {
        paddingTop: 20,  
        paddingBottom: 20,  
        paddingLeft: 10,  
    },
    titleText: {
        fontSize: 24,
    },
    routesList: {
        flex: 1,  
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
    },
    menuItem: {
        padding: 20,
        borderColor: '#1D201F',
        borderTopWidth: 1,
    },
    menuItemText: {
        fontSize: 18,
    }
});