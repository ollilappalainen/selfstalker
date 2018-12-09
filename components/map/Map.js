import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';

/* Custom imports */
import { mapboxToken } from '../utils/config';
import GeoJSON from '../geoJSON/GeoJSON';

Mapbox.setAccessToken(mapboxToken);

const LATITUDE = 60.192059;
const LONGITUDE = 24.945831;
const ZOOM  = 15;

export default class Map extends Component {
    constructor() {
        super();        

        this.state = {
            coords: [LONGITUDE, LATITUDE],
            zoom: ZOOM,  
            centeredToPosition: false, 
            showUserLocation: true, 
            trackingMode: Mapbox.UserTrackingModes.Follow,
            isRecording: false,   
        };
        
        this.GeoJSON = new GeoJSON();
    }

    centerMapToPosition = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const coords = [position.coords.longitude, position.coords.latitude];

            this.map.setCamera({
                centerCoordinate: coords,
            });
        }, error => console.log('Error getting device position: ', error), {
            timeout: 2000,
            maximumAge: 2000,
            enableHighAccuracy: true,
        });
    }

    fitToLayer = async () => {
        const coords = this.props.routeCoords;

        this.map.fitBounds(coords[0], coords[coords.length - 1], [50, 150], 500);
    }

    componentDidMount() {
        const isRecording = this.props.isRecording;

        if (isRecording) {
            this.setState({ 
                isRecording: isRecording, 
                trackingMode: Mapbox.UserTrackingModes.Follow,
            });
        } else {
            this.setState({ 
                isRecording: false, 
                trackingMode: Mapbox.UserTrackingModes.None,
            });
        }
    }

    componentDidUpdate() {
        if (this.props.focusToUser === true) {
            this.centerMapToPosition();
        }
    }

    renderLine() {
        const coords = this.props.routeCoords;

        if (coords.length < 2) {
            return null;
        }

        const coordsJSON = this.GeoJSON.line(this.props.routeCoords, 'newRoute');
        
        if (!this.state.isRecording) this.fitToLayer();

        return(
            <Mapbox.Animated.ShapeSource id='routeLine' shape={coordsJSON}>
                <Mapbox.Animated.LineLayer id='line1' style={{lineColor: '#314ccd', lineWidth: 3,}} />
            </Mapbox.Animated.ShapeSource>
        )
    }

    render() {
        return(
            <View style={styles.container}>
                <Mapbox.MapView
                    ref={(ref) => (this.map = ref)}
                    styleURL={Mapbox.StyleURL.Dark}
                    onDidFinishRenderingMapFully={this.onRegionDidChange}
                    zoomLevel={this.state.zoom}
                    centerCoordinate={this.state.coords}
                    style={styles.container}
                    showUserLocation={this.state.showUserLocation}
                    userTrackingMode={this.state.trackingMode}>
                    {this.renderLine()}
                </Mapbox.MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    }
});