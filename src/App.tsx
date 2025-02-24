import { useState } from 'react'
import './App.css'
import PrefectureCheckboxList from './components/PrefectureCheckboxList'
import PopulationChart from './components/PopulationChart'
import type { PopulationEntry } from './components/PrefectureCheckboxList'


function App() {
  const [mergedData, setMergedData] = useState<PopulationEntry[]>([]) // グラフ用のデータ
  const [selectedPrefNames, setSelectedPrefNames] = useState<string[]>([]) // 選択された都道府県名
  const [selectedCategory, setSelectedCategory] = useState('総人口')

  return (
    <div>
      <h1>都道府県別人口推移</h1>
      {/* PrefectureCheckboxList に setMergedData を渡す */}
      <PrefectureCheckboxList
        setMergedData={setMergedData}
        setSelectedPrefNames={setSelectedPrefNames}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
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
