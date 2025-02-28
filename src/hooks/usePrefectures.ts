// hooks/usePrefectures.ts（都道府県データの取得）
// ✅ 都道府県データの取得を usePrefectures に分離！
// ✅ App.tsx でこのフックを使うことで、データ取得の責務を移動。
import { useEffect, useState } from 'react'

export type Prefecture = {
  prefCode: number
  prefName: string
}

export const usePrefectures = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])

  useEffect(() => {
    fetch(
      'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures',
      {
        headers: {
          'X-API-KEY': import.meta.env.VITE_RESAS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setPrefectures(data.result))
      .catch((error) => console.error('都道府県データ取得失敗:', error))
  }, [])

  return { prefectures }
}
