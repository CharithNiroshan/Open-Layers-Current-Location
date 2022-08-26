import React, {useEffect} from "react";
import "./assets/css/app.css";
import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import Geolocation from 'ol/Geolocation';
import Point from 'ol/geom/Point';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';

function App() {
    const layers = new TileLayer({
        source: new OSM(),
    });

    const view = new View({
        center: [0, 0],
        zoom: 2,
    });

    const positionFeature = new Feature();
    const accuracyFeature = new Feature();

    positionFeature.setStyle(
        new Style({
            image: new CircleStyle({
                radius: 6,
                fill: new Fill({
                    color: '#3399CC',
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 2,
                }),
            }),
        })
    );

    const source = new VectorSource({
        features: [accuracyFeature, positionFeature],
    });

    const map = new Map({
        target: undefined,
        layers: [layers],
        view: view
    });

    new VectorLayer({
        map: map,
        source: source,
    });

    const geolocation = new Geolocation({
        trackingOptions: {
            enableHighAccuracy: true,
        },
        projection: view.getProjection(),
    });

    geolocation.on('change:accuracyGeometry', function () {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
    });

    geolocation.on('change:position', function () {
        const coordinates = geolocation.getPosition();
        positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
    });

    const locateMe = () => {
        geolocation.setTracking(true);
    }

    useEffect(
        () => {
            map.setTarget('map');
        }
        , []
    )

    return (
        <div className="app">
            <div className="map-container">
                <div id='map'/>
                <button onClick={locateMe} className='button'>Locate Me</button>
            </div>
        </div>
    )
}

export default App;
