// App.tsx（状態管理 & フックの利用）
// ✅ App.tsx では 都道府県のデータ取得 (usePrefectures) や 人口データ管理 (usePopulationData) を担当し、
// ✅ PrefectureCheckboxList.tsx にデータを渡すだけ。
import { useState } from 'react'
import PrefectureCheckboxList from './components/PrefectureCheckboxList'
import PopulationChart from './components/PopulationChart'
import { usePrefectures } from './hooks/usePrefectures'
import { usePopulationData } from './hooks/usePopulationData'
import './App.css'


function App() {
  const { prefectures } = usePrefectures()
  const [selectedPrefs, setSelectedPrefs] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState('総人口')

  // 人口データ取得フックを呼び出し
  const { mergedData, selectedPrefNames } = usePopulationData(
    selectedPrefs,
    selectedCategory,
    prefectures
  )

  // チェックボックスの変更処理
  const handleCheck = (prefCode: number, checked: boolean) => {
    if (checked) {
      setSelectedPrefs((prev) => [...prev, prefCode])
    } else {
      setSelectedPrefs((prev) => prev.filter((p) => p !== prefCode))
    }
  }

  return (
    <div>
      <h1>都道府県別人口推移</h1>
      <PrefectureCheckboxList
        prefectures={prefectures}
        selectedPrefs={selectedPrefs}
        onCheck={handleCheck}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <PopulationChart
        data={mergedData}
        selectedPrefNames={selectedPrefNames}
      />
    </div>
  )
}

export default App
