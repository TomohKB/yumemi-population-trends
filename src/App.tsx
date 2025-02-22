import { useState } from 'react'
import './App.css'
import PrefectureCheckboxList from './components/PrefectureCheckboxList'
import PopulationChart from './components/PopulationChart'

function App() {
  const [mergedData, setMergedData] = useState([]) // グラフ用のデータ
  const [selectedPrefNames, setSelectedPrefNames] = useState<string[]>([]) // 選択された都道府県名

  return (
    <div>
      <h1>都道府県別人口推移</h1>
      {/* PrefectureCheckboxList に setMergedData を渡す */}
      <PrefectureCheckboxList
        setMergedData={setMergedData}
        setSelectedPrefNames={setSelectedPrefNames}
      />
      {/* PopulationChart にデータを渡す */}
      <PopulationChart
        data={mergedData}
        selectedPrefNames={selectedPrefNames}
      />
    </div>
  )
}

export default App
