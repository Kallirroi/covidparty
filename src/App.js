import React, {useState} from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'; 
import Sneeze from './sneeze.png';
import Cough from './cough.gif';
import {token} from './config';
import './App.css';

const Map = ReactMapboxGl({
  accessToken: token,
  doubleClickZoom: false,
  touchZoomRotate: false,
  // scrollZoom: false,
}); 
const image = new Image(100, 100);
image.src=''

function App() {

  const [zoom, setZoom] = useState([15]);
  const [center, setCenter] = useState([-77.0367000, 38.8968324]);
  const [points, setPoints] = useState([]);
  const [panelVisible, setPanelVisible] = useState(true);
  const images = ["myImage", image]; 

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
    if (effect === 'sneeze') image.src = Sneeze; 
    if (effect === 'cough') image.src = Cough;
  }

  return (
    <div className="App">
      <div className='Counter'> 
        There have been <div className='number'>{points.length}</div> sneezes or coughs so far.
      </div>
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
        style="mapbox://styles/mapbox/light-v10"
        center = {center}
        zoom={zoom}
        containerStyle={{
          height: '100vh',
          width: '100vw'
        }}
        onClick={handleClick}
      >
      <Layer 
        type="symbol" 
        id="marker" 
        layout={{ "icon-image": "myImage", "icon-allow-overlap": true }}
        images={images}>
        {points.map((point, i) => <Feature key={i} coordinates={point} />)}
      </Layer>
      </Map>
    </div>
  );
}

export default App;
