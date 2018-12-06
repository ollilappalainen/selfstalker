import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';

/* Custom imports */
import { mapboxToken } from '../utils/config';
import GeoJSON from '../geoJSON/GeoJSON';

Mapbox.setAccessToken(mapboxToken);

const LATITUDE = 60.192059;
const LONGITUDE = 24.945831;
const ZOOM  = 11;

export default class Map extends Component {
    constructor() {
        super();        

        this.state = {
            coords: [LONGITUDE, LATITUDE],
            zoom: ZOOM,            
        };
        
        this.GeoJSON = new GeoJSON();
    }

    updateCoords = async () => {
        const { coords } = this.props;

        await this.setState({ coords });
    }

    renderLine() {
        const coords = this.props.routeCoords;

        if (coords.length < 2) {
            return null;
        }

        const coordsJSON = this.GeoJSON.line(this.props.routeCoords, 'newRoute');

        return(
            <Mapbox.Animated.ShapeSource id='routeLine' shape={coordsJSON}>
                <Mapbox.Animated.LineLayer id='line1' style={{lineColor: '#314ccd', lineWidth: 3,}} />
            </Mapbox.Animated.ShapeSource>
        )
    }

    renderAnnotations() {
        return (
            <Mapbox.PointAnnotation
                key='pointAnnotation'
                id='pointAnnotation'
                coordinate={[11.254, 43.772]}>
        
                <View style={styles.annotationContainer}>
                    <View style={styles.annotationFill} />
                </View>
                <Mapbox.Callout title='Look! An annotation!' />
            </Mapbox.PointAnnotation>
        )
    }

    render() {
        return(
            <View style={styles.container}>
                <Mapbox.MapView
                    styleURL={Mapbox.StyleURL.Dark}
                    zoomLevel={this.state.zoom}
                    centerCoordinate={this.state.coords}
                    style={styles.container}
                    showUserLocation={true}>
                    {this.renderAnnotations()}
                    {this.renderLine()}
                </Mapbox.MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
    annotationContainer: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
    },
    annotationFill: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'orange',
        transform: [{
            scale: 0.6
        }],
    }
});