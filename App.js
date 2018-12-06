import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableNativeFeedback, AsyncStorage } from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import firebase from 'firebase';

//Custom imports
import Map from './components/map/Map';
import GeoJSON from './components/geoJSON/GeoJSON';
import { databaseConfig } from './components/utils/config';

const IS_ANDROID = Platform.OS === 'android';

if (!firebase.apps.length) {
    firebase.initializeApp(databaseConfig);
}

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            watchId: null,
            coords: null,
            isFetchingAndroidPermission: IS_ANDROID,
            isAndroidPermissionGranted: false,
            routeCoords: [],
            isRecording: false,
            routes: null,
            routesCount: 0,
        };          

        this.GeoJSON = new GeoJSON();
    }

    updaterouteCoords = async (coords) => {
        let array = this.state.routeCoords;
        const lastIndex = array.length - 1;

        if (array.length > 0) {
            if (array[lastIndex] !== coords) array.push(coords);
        } else {
            array.push(coords);
        }

        await this.setState({ routeCoords: array });
    }

    watchLocation = () => {
        const watchId = navigator.geolocation.watchPosition(position => {
            const coords = [position.coords.longitude, position.coords.latitude];
            this.setState({ coords });
            this.updaterouteCoords(coords);
        }, error => console.log('Error in watching position: ', error),
        {
            timeout: 2000,
            maximumAge: 0,
            enableHighAccuracy: true,
            distanceFilter: 2
        });

        this.setState({ watchId });
    }

    getPosition = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const coords = [ position.coords.longitude, position.coords.latitude ];
            this.setState({ coords });
        }, error => console.log('Error getting device position: ', error),
        {
            timeout: 2000,
            maximumAge: 2000,
            enableHighAccuracy: true,
        });
    }

    componentDidMount() {
        this.getPosition();        
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

    fetchAllRoutes = async () => {        
        firebase.database().ref('Routes/').once('value', routes => {
            this.setState({
                routes: routes.val(),
                routesCount: parseInt(routes.numChildren()),
            });
        });
    }

    storeRouteData = async () => {
        let { routesCount } = this.state;
        const name = `SavedRoute${routesCount++}`;
        const route = this.GeoJSON.line(this.state.routeCoords, name);

        await firebase.database().ref(`Routes/${name}`).set({ name, route });

        this.fetchAllRoutes();
    }

    onRecordButtonPress = async () => {
        let isRecording;

        if (this.state.isRecording) {
            isRecording = false;            
            navigator.geolocation.clearWatch(this.state.watchId);
            this.storeRouteData();
            await this.setState({ 
                isRecording: isRecording,
                routeCoords: []         
            }); 
        } else {
            isRecording = true;
            await this.setState({ isRecording });
            this.watchLocation();
        }
    }

    renderRecordButton() {
        const text = this.state.isRecording ? 'Stop Stalking' : 'Start Stalking';
        const activeStyle = this.state.isRecording ? styles.recordButtonActive : styles.recordButtonInactive;

        return(
            <TouchableNativeFeedback
                onPress={this.onRecordButtonPress}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={[styles.recordButton, activeStyle]}>
                    <Text style={styles.recordButtonText}>{text.toUpperCase()}</Text>
                </View>
            </TouchableNativeFeedback>
        )
    }

    renderCenterToPositionButton() {

    }

    render() {
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
                <Map routeCoords={this.state.routeCoords} />  
                <View>

                </View>                   
                <View style={styles.buttonWrapper}>
                    {this.renderRecordButton()}
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
