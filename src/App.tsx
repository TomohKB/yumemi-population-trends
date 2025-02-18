import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PrefectureCheckboxList from './components/PrefectureCheckboxList'

function App() {
  return (
    <div>
      <h1>都道府県別人口推移</h1>
      <PrefectureCheckboxList />
    </div>
  )
}

export default App
