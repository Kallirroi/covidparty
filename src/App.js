import React, {useState} from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'; 
import {token} from './config';
import './App.css';

const Map = ReactMapboxGl({
  accessToken: token,
  doubleClickZoom: false,
  touchZoomRotate: false,
  scrollZoom: false,
}); 

function App() {

  const [zoom, setZoom] = useState([15]);
  const [center, setCenter] = useState([-77.0367000, 38.8968324]);
  const [points, setPoints] = useState([]);
  const [panelVisible, setPanelVisible] = useState(true);

  const handleClick = (map, ev) => {
    const { lng, lat } = ev.lngLat;
    setPoints( prevState => [...prevState, [lng, lat]]);
    setZoom( prevState => [...prevState, [map.transform.tileZoom + map.transform.zoomFraction]]);
    setCenter(map.getCenter());

    // set coordinates to Firebase API ? 

  };

  const buttonClick = (e) => {
    setPanelVisible(false);
    let effect = e.target.id
    // set custom pin or audio here according to ID clicked
  }

  return (
    <div className="App">
      {panelVisible && 
      <div className="Overlay">
        <div className='frame'>
        <p>Today I feel like</p>
          <button onClick={buttonClick} id='cough'>coughing</button>
          <button onClick={buttonClick} id='sneeze'>sneezing</button>
        <p>around the White House</p>
        </div>
      </div>
      }
      <Map
        style="mapbox://styles/mapbox/dark-v10"
        center = {center}
        zoom={zoom}
        containerStyle={{
          height: '100vh',
          width: '100vw'
        }}
        onClick={handleClick}
      >
      <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
        {points.map((point, i) => <Feature key={i} coordinates={point} />)}
      </Layer>
      </Map>
    </div>
  );
}

export default App;
