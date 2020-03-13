import React, {useState} from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'; 
import firebase from 'firebase';
import { FirebaseDatabaseProvider, FirebaseDatabaseMutation, FirebaseDatabaseNode } from "@react-firebase/database";

import Sneeze from './assets/sneeze.png';
import Cursor from './assets/cursor.png';
import Cough from './assets/cough.png';
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

function App() {

  const [zoom, setZoom] = useState([15]);
  const [center, setCenter] = useState([-77.0367000, 38.8968324]);
  const [points, setPoints] = useState([]); //retrieve points from Firebase API
  const [panelVisible, setPanelVisible] = useState(true);
  const images = ["myImage", image]; 

  const buttonClick = (e) => {
    setPanelVisible(false);
    let effect = e.target.id
    if (effect === 'sneeze') image.src = Sneeze; 
    if (effect === 'cough') image.src = Cough;
  }

  return (
    <FirebaseDatabaseProvider {...firebaseConfig} firebase={firebase}>
      <div className="App">
        <div className='Counter'> 
          There have been 

          <FirebaseDatabaseNode path="points/">
          {({ value }) => {
            if (value === null || typeof value === "undefined") return null;
            const keys = Object.keys(value);
            return (
              <div className='number'>{keys.length}</div> 
            )
          }}
        </FirebaseDatabaseNode>

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
        <FirebaseDatabaseMutation type="push" path="points">
          {({ runMutation }) => (
            <Map
              style="mapbox://styles/mapbox/light-v10"
              center = {center}
              zoom={zoom}
              containerStyle={{
                height: '100vh',
                width: '100vw'
              }}
              onClick={ async (map, ev) => {
                
                const { lng, lat } = ev.lngLat;
                setPoints( prevState => [...prevState, [lng, lat]]);
                setZoom( prevState => [...prevState, [map.transform.tileZoom + map.transform.zoomFraction]]);
                setCenter(map.getCenter());

                // save to DB
                await runMutation({
                  point_lat: lat,
                  point_long: lng,
                  created_at: firebase.database.ServerValue.TIMESTAMP,
                  updated_at: firebase.database.ServerValue.TIMESTAMP
                });
              }}
              >
              <Layer 
                type="symbol" 
                id="marker" 
                layout={{ "icon-image": "myImage", "icon-allow-overlap": true }}
                images={images}>
                {points.map((point, i) => <Feature key={i} coordinates={point} />)}
              </Layer>
            </Map>
          )}
        </FirebaseDatabaseMutation>;
      </div>
    </FirebaseDatabaseProvider>
  );
}

export default App;
