import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableNativeFeedback } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import firebase from 'firebase';
import SideMenu from 'react-native-side-menu';
import { Icon } from 'react-native-elements'

//Custom imports
import Map from './components/map/Map';
import GeoJSON from './components/geoJSON/GeoJSON';
import { databaseConfig } from './components/utils/config';
import Menu from './components/menu/Menu';

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
            selectedRoute: null,
            isMenuOpen: false,
            focusToUser: false,
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

    fetchAllRoutes = async () => {       
        const routes = [];

        await firebase.database().ref('Routes/').once('value')
            .then(snapshot => {
                snapshot.forEach(child => {
                    routes.push(child.val());
                });
            });

        this.setState({
            routes: routes,
            routesCount: routes.length,
        });
    }

    storeRouteData = async () => {
        const date = new Date();
        let { routesCount } = this.state;        
        const name = `SavedRoute${date.getTime()}`;
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
            await this.setState({ 
                isRecording: isRecording, 
                routeCoords: [] });

            this.watchLocation();
        }
    }

    toggleMenu = () => {
        this.setState({
            isMenuOpen: this.state.isMenuOpen ? false : true,
        });
    }

    handleRouteSelect = async selectedRoute => {
        await this.setState({ routeCoords: selectedRoute.route.geometry.coordinates });
        this.toggleMenu();
    }

    updateMenuState = (isMenuOpen) => {
        this.setState({ isMenuOpen });
    }    
    
    componentDidMount() {
        this.getPosition(); 
        this.fetchAllRoutes();       
    }

    async componentWillMount() {
        if (IS_ANDROID) {
            const isGranted = await Mapbox.requestAndroidLocationPermissions();

            this.setState({
                isAndroidPermissionGranted: isGranted,
                isFetchingAndroidPermission: false,
            });
        }        
    }

    onFocusToUserButtonPress = async () => {
        await this.setState({
            focusToUser: !this.state.focusToUser,
        });

        await this.setState({
            focusToUser: !this.state.focusToUser,
        });
    }

    renderFocusToUserButton() {                
        return (
            <TouchableNativeFeedback
                onPress={this.onFocusToUserButtonPress}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={styles.focusToUserButton}>
                    <Icon name='location-on' color='#1D201F' size={30} />
                </View>
            </TouchableNativeFeedback>
        )
    }

    renderRecordButton() {
        const text = this.state.isRecording ? 'Stop Stalking' : 'Start Stalking';
        const activeStyle = this.state.isRecording ? styles.recordButtonActive : styles.recordButtonInactive;

        return (
            <TouchableNativeFeedback
                onPress={this.onRecordButtonPress}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={[styles.recordButton, activeStyle]}>
                    <Text style={styles.recordButtonText}>{text.toUpperCase()}</Text>
                </View>
            </TouchableNativeFeedback>
        )
    }

    renderMenuToggle() {      
        const text = 'Menu';
        const icon = this.state.isMenuOpen ? 'chevron-left' : 'chevron-right';

        return (
            <TouchableNativeFeedback
                onPress={this.toggleMenu}
                background={TouchableNativeFeedback.SelectableBackground()}>

                <View style={styles.toggleMenuButton}>
                    <Icon name={icon} color='#E9ECF5' size={40} />
                </View>
            </TouchableNativeFeedback>
        )
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

        const menu = <Menu routes={this.state.routes} onRouteSelect={this.handleRouteSelect} />

        return (         
            <SideMenu 
            menu={menu}
            isOpen={this.state.isMenuOpen}
            onChange={isOpen => this.updateMenuState(isOpen)}>
                <View style={styles.container}>
                    <Map routeCoords={this.state.routeCoords} isRecording={this.state.isRecording} focusToUser={this.state.focusToUser} />  
                    <View>

                    </View>                   
                    <View style={styles.buttonWrapper}>
                        {this.renderRecordButton()}
                    </View>
                    {this.renderMenuToggle()}
                    {this.renderFocusToUserButton()}
                </View>
            </SideMenu>               
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
    },
    toggleMenuButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: '#993955',
        position: 'absolute',
        borderRadius: 90,
        borderWidth: 3,
        borderColor: '#1D201F',
        width: 80,
        height: 80,
        top: 20,
        left: -40,
    },
    focusToUserButton: {
        borderRadius: 90,
        width: 50,
        height: 50,
        position: 'absolute',
        top: 20,
        right: 10,
        borderColor: '#993955',
        borderWidth: 2,
        backgroundColor: '#E9ECF5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
