import React, { Component } from 'react';
import { AppRegistry, Platform, StyleSheet, Text, View } from 'react-native';

//Custom imports
// import StalkUser from './components/service/StalkUser';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            watchId: null,
            position: null,
        };
    }

    watchLocation = () => {
        const watchId = navigator.geolocation.watchPosition(position => {
            this.setState({ position });
        }, error => console.log('Error in watching position: ', error),
        {
            timeout: 2000,
            maximumAge: 0,
            enableHighAccuracy: true,
            distanceFilter: 0
        });

        this.setState({ watchId });
    }

    componentDidMount() {
        console.log('Attempt to watch location');
        this.watchLocation();
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.state.watchId);
    }

    render() {
        let time, lat, lng, date, timeString;

        if (this.state.position) {
            time = this.state.position.timestamp;
            lat = this.state.position.coords.latitude;
            lng = this.state.position.coords.longitude;
        } else {
            time = new Date().getTime();
            lat = '';
            lng = '';
        }

        date = new Date(time);
        timeString = date.toString();

        return (
            <View style={styles.container}>
                <Text style={styles.instructions}>Time: {timeString}</Text>
                <Text style={styles.instructions}>Lat: {lat}</Text>
                <Text style={styles.instructions}>Lng: {lng}</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

// AppRegistry.registerHeadlessTask('StalkUser', () => stalk);
