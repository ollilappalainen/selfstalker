import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';

Mapbox.setAccessToken('pk.eyJ1IjoibWFzdGVyaGlsbG8iLCJhIjoiY2pvZXJ4dmJvMXp3czNrbGV0cXh3bm45YSJ9.b6IZ6c7NN58__-9zCUoGdw');

export default class Map extends Component {
    constructor() {
        super();

        this.state = {

        };
    }

    render() {
        return(
            <View style={styles.container}>
                <Mapbox.MapView
                    styleURL={Mapbox.StyleURL.Street}
                    zoomLevel={12}
                    centerCoordinate={[8.5333396, 47.388]}
                    style={styles.container}>
                </Mapbox.MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});