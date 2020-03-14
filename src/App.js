import React, {useState} from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'; 
import firebase from 'firebase';
import randomstring from 'randomstring';
import { useListVals } from 'react-firebase-hooks/database';
import useResizeAware from 'react-resize-aware'; 
import dotenv from 'dotenv'; 
import Cursor from './assets/cursor.png';
import './App.css';

dotenv.config()
const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_token,
  doubleClickZoom: false,
  touchZoomRotate: false,
  // scrollZoom: false,
}); 
const image = new Image(100, 60);
image.src=Cursor
const images = ["myImage", image]; 

firebase.initializeApp({
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId
})

function App() {

  const [zoom, setZoom] = useState([15]);
  const [center, setCenter] = useState([-77.0367000, 38.8968324]);
  const [panelVisible, setPanelVisible] = useState(true);
  const [points] = useListVals(firebase.database().ref('points'));
  const [resizeListener, sizes] = useResizeAware();

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
          {resizeListener} 
          <div className='frame' style={{width: 0.5*sizes.width, top: 0.2*sizes.height}}>
            <p>Today I feel like</p>
              <button onClick={buttonClick} id='cough'>coughing</button>
              <button onClick={buttonClick} id='sneeze'>sneezing</button>
            <p>around the White House</p>
          </div>
        </div>
        }

        <Map
          style={'mapbox://styles/mapbox/dark-v10'}
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

        <div className='credits'>Made by <a href="https://kalli-retzepi.com/" target='_blank' rel="noopener noreferrer" >Kalli</a> during her time at the <a href="https://www.recurse.com/" target='_blank' rel="noopener noreferrer">Recurse Center</a>.</div>

        <div style={{display: 'none'}}>
          <audio className="cough">
            <source src="cough.wav"></source>
          </audio>
          <audio className="sneeze">
            <source src="sneeze.wav"></source>
          </audio>
        </div>
      </div>
  );
}

export default App;
