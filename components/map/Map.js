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
        
        const { coords } = this.this.props.position ? this.this.props.position : null;

        this.state = {
            lat: coords.latitude ? coords.latitude : LATITUDE,
            lng: coords.longitude ? coords.longitude : LONGITUDE,
            zoom: ZOOM,
            positionArray: null,
        };  
        
        this.GeoJSON = new GeoJSON();
    }

    updatePositionArray = (coords) => {
        let array = this.state.positionArray;

        if (array) {
            const lastIndex = array.length - 1;

            if (array[lastIndex] !== coords) array.push(coords);
    
            this.setState({ positionArray: array });
        }        
    }

    updateCoords = () => {
        const { position } = this.props;

        this.setState({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        });

        const coords = [position.coords.latitude, position.coords.longitude];
        this.updatePositionArray(coords);
    }

    renderLine = () => {        
        const coords = this.state.positionArray;

        if (coords) {
            const json = this.GeoJSON.line(coords, 'test_line');

            console.log('asdasd', json);
        } else {
            console.log('asdasd no json no');
        }        
    }

    renderAnnotations () {
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

    componentDidUpdate() {        
        this.updateCoords();
        this.renderLine();
    }

    render() {
        return(
            <View style={styles.container}>
                <Mapbox.MapView
                    styleURL={Mapbox.StyleURL.Dark}
                    zoomLevel={this.state.zoom}
                    centerCoordinate={[this.state.lng, this.state.lat]}
                    style={styles.container}
                    showUserLocation={true}>
                    {this.renderAnnotations()}
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