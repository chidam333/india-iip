import { useState } from 'react'
import india from "./assets/india.svg"
import * as indiaGeoJson from './assets/india_states.json'
import './styles.css'
import stateCodeJson from './assets/stateCode.json'
import IndiaSVG from './IndiaSVG.jsx'
function App() {
  const [curState, setState] = useState("India")
  const [delState, setdelState] = useState("India")
  const [states,setStates] = useState(new Set())
  const [curLocation,setLocation] = useState("")
  const [render,setRender] = useState(0)
  let indianSouth = [93.828,6.753]
  let indianNorth = [74.70,37.08]
  let indianWest = [68.18,23.72]
  let indianEast = [97.40,28.18]
  let is_touchscreen = ()=>{
    return ( 'ontouchstart' in window ) ||
    ( navigator.maxTouchPoints > 0 ) ||
    ( navigator.msMaxTouchPoints > 0 );
  }
  let fill = (clientX,clientY) =>{
    let code;
    if(is_touchscreen){
      code = calculateLatLon(clientX,clientY)
    }else{
      code = stateCodeJson[curState]
    }
    let newState = new Set(states)
    if(states.has(code)){
      newState.delete(code)
      setdelState(code)
    }else{
      newState.add(code)
    }
    setStates(newState)
    setRender(!render)
  }
  let calculateLatLon = (clientX,clientY) =>{
    let mapHeight = document.querySelector(".map").clientHeight
    let mapWidth = document.querySelector(".map").clientWidth
    let mapLeft = document.querySelector(".map").clientLeft
    let x = clientX-mapLeft
    let y = mapHeight-clientY
    let realLon = indianWest[0]+((indianEast[0]-indianWest[0])/mapWidth)*x
    let realLat = indianSouth[1]+((indianNorth[1]-indianSouth[1])/mapHeight)*y
    return findState(realLat,realLon,clientX,clientY)
  }
  let findState = (lat,lon,clientX,clientY)=>{
    lat+=0.5
    for(const polygon of indiaGeoJson.features){
      let state = polygon.properties.ST_NM
      let crossPolygon = 0
      try{
        if(polygon.geometry.coordinates[0][0].length == undefined) continue 
      }catch(e){
        continue
      }
      for(let i = 0;i<polygon.geometry.coordinates[0][0].length-2;++i){
        let x1 = polygon.geometry.coordinates[0][0][i][0]
        let y1 = polygon.geometry.coordinates[0][0][i][1]
        let x2 = polygon.geometry.coordinates[0][0][i+1][0]
        let y2 = polygon.geometry.coordinates[0][0][i+1][1]
        if(lat<y1!=lat<y2 && lon<(x2-x1)*(lat-y1)/(y2-y1)+x1){
          crossPolygon++
        }
      }
      // console.log({crossPolygon,state})
      if(crossPolygon%2!=0){
        if(`${lat}+${lon}`!=curLocation){
          setLocation(`${lat}+${lon}`)
          setState(`${state}`)
          let tooltip = document.querySelector("#tooltip")
          if(tooltip==null){
            tooltip = document.createElement("div")
            let map = document.querySelector(".mapContain")
            tooltip.setAttribute("id","tooltip")
            map.appendChild(tooltip)
          }
          tooltip.innerHTML = state
          tooltip.style.left = `${clientX+18}px`
          tooltip.style.top = `${clientY+18}px`
          return state
        }
      }
    }
    return "India"
  }
  return (
    <div className="w-[100vw] flex mapContain">
      <div className="map block my-auto" onMouseMove={e=>{if(!is_touchscreen){calculateLatLon(e.clientX,e.clientY)}}} onClick={e=>{fill(e.clientX,e.clientY)}}><IndiaSVG states={states} render={render} delState={delState}/></div>
      <h1>{curState}</h1>
    </div>
  )
}

export default App
