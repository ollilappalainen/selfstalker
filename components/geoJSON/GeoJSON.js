export default class GeoJSON {
    /**
     * @return Object
     * @var type: string GeoJSON geometry type
     * @var coordinates: Array Array of coordinates [lat, lng] or [[lat, lng], [lat, lng]]
     * @var name: string Name of geometry
     */
    parseGeoJSONFromCoords = (type, coordinates, name) => {
        return {
            "type": "Feature",
            "geometry": {
                "type": type,
                "coordinates": coordinates
            },
            "properties": {
                "name": name
            }
        }
    }

    /**
     * @return Object
     * @var coordinates Array of coordinates [lat, lng] or [[lat, lng], [lat, lng]]
     * @var name Name of geometry
     */
    line = (coordinates, name) => {
        return this.parseGeoJSONFromCoords('LineString', coordinates, name);
    }

    return() {
        this.line;
    };
}
