import React, {useState, useEffect} from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'; 
import firebase from 'firebase';
import randomstring from 'randomstring';
import { useListVals } from 'react-firebase-hooks/database';

import Cursor from './assets/cursor.png';
import {token, firebaseConfig} from './config';
import './App.css';

const Map = ReactMapboxGl({
  accessToken: token,
  doubleClickZoom: false,
  touchZoomRotate: false,
  // scrollZoom: false,
}); 
const image = new Image(100, 60);
image.src=Cursor
const images = ["myImage", image]; 

firebase.initializeApp(firebaseConfig)

function App() {

  const [zoom, setZoom] = useState([15]);
  const [center, setCenter] = useState([-77.0367000, 38.8968324]);
  const [panelVisible, setPanelVisible] = useState(true);
  const [points, loading, error] = useListVals(firebase.database().ref('points'));
  

  const buttonClick = (e) => {
    e.preventDefault();
    setPanelVisible(false);
    playSound(e.target.id);
  }

  const playSound = (effect) => {
    const audioEl = document.getElementsByClassName(effect)[0]
    audioEl.play()
  }

  const handleClick = (map, ev) => {
    const { lng, lat } = ev.lngLat;
    setZoom( prevState => [...prevState, [map.transform.tileZoom + map.transform.zoomFraction]]);
    setCenter(map.getCenter());

    // save to DB
    firebase.database().ref('points/'+randomstring.generate(7)).set({
      coordinates: [lng, lat],
      created_at: new Date()
    });
  }

  return (
      <div className="App">
        <div className='Counter'> 
          There have been 
          <div className='number'>{points.length}</div> 
          sneezes or coughs so far.
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
          pitch={0}
          zoom={zoom}
          containerStyle={{
            height: '100vh',
            width: '100vw'
          }}
          onClick={handleClick}
          >
            <Layer
            type='symbol'
            id="marker" 
            layout={{ "icon-image": "myImage", "icon-allow-overlap": true}}
            images={images}
            >
            {points.map((point, i) => <Feature key={i} coordinates={point.coordinates} />)}
            </Layer>
        </Map>

        <audio className="cough">
          <source src="cough.wav"></source>
        </audio>
        <audio className="sneeze">
          <source src="sneeze.wav"></source>
        </audio>
      </div>
  );
}

export default App;
