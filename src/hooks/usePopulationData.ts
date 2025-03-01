// hooks/usePopulationData.ts（人口データの管理 & 加工）
// ✅ 人口データの取得 & 加工を usePopulationData に分離！
// ✅ App.tsx で呼び出し、データの管理を統一。
import { useState, useEffect } from 'react'
import { Prefecture } from './usePrefectures' // 都道府県データを取得するフック

export type PopulationEntry = {
  year: number
  [key: string]: number
}

// 1つの年ごとの人口データ
type PopulationDetail = {
  year: number
  value: number
}

// 各カテゴリ（総人口・年少人口など）のデータ
type PopulationCategory = {
  label: string // 人口カテゴリの名前（例: "総人口"）
  data: PopulationDetail[] // 各年の人口データ
}

// 都道府県コードごとの人口データ
type PopulationDataType = {
  [key: number]: { data: PopulationCategory[] } | undefined
}

export const usePopulationData = (
  selectedPrefs: number[],
  selectedCategory: string,
  prefectures: Prefecture[]
) => {
  const [populationData, setPopulationData] = useState<PopulationDataType>({})
  const [mergedData, setMergedData] = useState<PopulationEntry[]>([])
  const [selectedPrefNames, setSelectedPrefNames] = useState<string[]>([])

  // ✅ 修正対象1: `useEffect` に `populationData` を追加
  useEffect(() => {
    selectedPrefs.forEach((prefCode) => {
      if (!populationData[prefCode]) {
        fetch(
          `https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear?prefCode=${prefCode}`,
          {
            headers: {
              'X-API-KEY': import.meta.env.VITE_RESAS_API_KEY,
              'Content-Type': 'application/json',
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            setPopulationData((prev) => ({ ...prev, [prefCode]: data.result }))
          })
          .catch((error) => console.error('人口データ取得失敗:', error))
      }
    })
  }, [selectedPrefs, populationData]) // ✅ `populationData` を依存配列に追加（修正済み）

  // ✅ 修正対象2: `useEffect` に `selectedPrefNames` を追加
  useEffect(() => {
    if (selectedPrefs.length === 0) {
      setMergedData([])
      setSelectedPrefNames([])
      return
    }

    const transformedData: PopulationEntry[] = []

    selectedPrefs.forEach((prefCode) => {
      const prefName =
        prefectures.find((p) => p.prefCode === prefCode)?.prefName ||
        `不明-${prefCode}` // ✅ 都道府県名を取得
      const populationDetails = populationData[prefCode]?.data?.find(
        (cat: PopulationCategory) => cat.label === selectedCategory
      )?.data

      if (populationDetails) {
        populationDetails.forEach((yearData: PopulationDetail) => {
          let entry = transformedData.find((d) => d.year === yearData.year)
          if (!entry) {
            entry = { year: yearData.year }
            transformedData.push(entry)
          }
          entry[prefName] = yearData.value // ✅ データに正式な都道府県名をセット
        })
      }
    })

    setMergedData(transformedData)
    setSelectedPrefNames(
      selectedPrefs.map(
        (prefCode) =>
          prefectures.find((p) => p.prefCode === prefCode)?.prefName ||
          `不明-${prefCode}`
      )
    )

    console.log('🛠 Merged Data:', transformedData)
    console.log('🛠 Selected Pref Names:', selectedPrefNames)
  }, [
    populationData,
    selectedPrefs,
    selectedCategory,
    prefectures,
    selectedPrefNames,
  ]) // ✅ `selectedPrefNames` を依存配列に追加（修正済み）

  return { mergedData, selectedPrefNames }
}
