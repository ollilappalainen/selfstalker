import React, { Component } from 'react';
import { AppRegistry, Platform, StyleSheet, Text, View } from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';

//Custom imports
import Map from './components/map/Map';

const IS_ANDROID = Platform.OS === 'android';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            watchId: null,
            position: null,
            isFetchingAndroidPermission: IS_ANDROID,
            isAndroidPermissionGranted: false,
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

    async componentWillMount() {
        if (IS_ANDROID) {
            const isGranted = await MapboxGL.requestAndroidLocationPermissions();
            this.setState({
                isAndroidPermissionGranted: isGranted,
                isFetchingAndroidPermission: false,
            });
        }        
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

        if (IS_ANDROID && !this.state.isAndroidPermissionGranted) {
            if (this.state.isFetchingAndroidPermission) {
                return null;
            }

            return (
                <View>
                    <Text>
                        You need to accept location permissions in order to use this application.
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <Map />     
                <View style={styles.mapOverlayContainer}>
                    <Text style={styles.instructions}>Time: {timeString}</Text>
                    <Text style={styles.instructions}>Lat: {lat}</Text>
                    <Text style={styles.instructions}>Lng: {lng}</Text>
                </View>                           
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
    mapOverlayContainer: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
    }
});
