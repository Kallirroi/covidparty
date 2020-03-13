import React, {useState} from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'; 
import './App.css';

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1Ijoia2FsbGlycm9pIiwiYSI6ImNrN3BsbmE0bzAxaGczZnBydnQ5Y2ZvbTkifQ.EopO3KKBRWLJ9C-euZSDdQ'
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
  };

  const buttonClick = () => {
    setPanelVisible(false);
  }

  return (
    <div className="App">
      {panelVisible && 
      <div className="Overlay">
        <div className='frame'>
        <p>Today I feel like</p>
          <button onClick={buttonClick} className='cough'>coughing</button>
          <button onClick={buttonClick} className='sneeze'>sneezing</button>
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
