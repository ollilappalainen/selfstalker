import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';

/* Custom imports */
import { mapboxToken } from '../utils/config';

Mapbox.setAccessToken(mapboxToken);

const LATITUDE = 60.192059;
const LONGITUDE = 24.945831;
const ZOOM  = 11;

export default class Map extends Component {
    constructor() {
        super();        

        this.state = {
            lat: LATITUDE,
            lng: LONGITUDE,
            zoom: ZOOM,
        };
    }

    updateCoords = () => {
        if (this.props.position) {
            const { position } = this.props;

            this.setState({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
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

    componentDidMount() {
        this.updateCoords();
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