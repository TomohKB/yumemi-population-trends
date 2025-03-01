//  PrefectureCheckboxList.tsx（チェックボックスの描画のみ）
// ✅ チェックボックスの表示のみに専念！
// ✅ データの取得や状態管理は App.tsx に移動！
import React from 'react'

type Prefecture = {
  prefCode: number
  prefName: string
}

type Props = {
  prefectures: Prefecture[]
  selectedPrefs: number[]
  onCheck: (prefCode: number, checked: boolean) => void
  selectedCategory: string // （ラジオボタンの選択状態）
  setSelectedCategory: (category: string) => void // （ラジオボタンの変更関数）
}

const PrefectureCheckboxList: React.FC<Props> = ({
  prefectures,
  selectedPrefs,
  onCheck,
  selectedCategory,
  setSelectedCategory,
}) => {
  const populationCategories = [
    '総人口',
    '年少人口',
    '生産年齢人口',
    '老年人口',
  ]

  return (
    <div>
      <h2>都道府県の選択</h2>
      <div className="prefecture-list">
        {prefectures.map((prefecture) => (
          <label key={prefecture.prefCode}>
            <input
              type="checkbox"
              value={prefecture.prefCode}
              checked={selectedPrefs.includes(prefecture.prefCode)}
              onChange={(e) => onCheck(prefecture.prefCode, e.target.checked)}
            />
            {prefecture.prefName}
          </label>
        ))}
      </div>

      {/* ラジオボタンを追加（人口の種類選択） */}
      <h3>人口の種類</h3>
      <div className="radio-group">
        {populationCategories.map((category) => (
          <label key={category} style={{ marginRight: '10px' }}>
            <input
              type="radio"
              value={category}
              checked={selectedCategory === category}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
            {category}
          </label>
        ))}
      </div>
    </div>
  )
}

export default PrefectureCheckboxList
