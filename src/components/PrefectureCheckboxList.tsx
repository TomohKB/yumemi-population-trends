import { useState, useEffect } from 'react'

type Prefecture = {
  prefCode: number
  prefName: string
}

type PopulationEntry = {
  year: number;
  [key: string]: number | string;
}

type PopulationDetail = {
  year: number
  value: number
}

type PopulationCategory = {
  label: string
  data: PopulationDetail[]
}

type PopulationData = {
  [key: number]: { data: PopulationCategory[] } | undefined
}

// Propsの型を定義（App.tsx から受け取る関数）
type Props = {
  setMergedData: (data: PopulationEntry) => void
  setSelectedPrefNames: (names: string[]) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

const PrefectureCheckboxList = ({
  setMergedData,
  setSelectedPrefNames,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [selectedPrefs, setSelectedPrefs] = useState<number[]>([])
  //都道府県の選択状況を管理するためのコード

  useEffect(() => {
    fetch(
      'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures',
      {
        method: 'GET',
        headers: {
          //APIにデータを送るときの「追加情報」のようなもの
          'X-API-KEY': import.meta.env.VITE_RESAS_API_KEY,
          //環境変数（.env に書いたAPIキー）を読み取っている！
          'Content-Type': 'application/json',
          //「リクエストの中身（データの種類）をサーバーに伝えるヘッダー」
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('取得したデータ:', data)
        setPrefectures(data.result)
        //data.resultの都道府県リストをsetPrefecturesに入れる
      })
      .catch((error) => console.error('データ取得の失敗:', error))
  }, [])

  const [populationData, setPopulationData] = useState<{ PopulationData }>({})
  // console.log(populationData);

  // 人口データを取得する関数
  const fetchPopulationData = (prefCode: number) => {
    fetch(
      `https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear?prefCode=${prefCode}`,
      {
        method: 'GET',
        headers: {
          'X-API-KEY': import.meta.env.VITE_RESAS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log({ prefCode }, data)
        setPopulationData((prevData) => ({
          ...prevData, // すでにあるデータを維持
          [prefCode]: data.result, // 新しいデータの追加
        }))
      })
      .catch((error) => console.error(`人口データ取得失敗：`, error))
  }

  //checkboxのOn,Offを切り替える
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const prefCode = Number(event.target.value)
    //チェックされた <input> タグの value を取得する
    // valueは文字列だからNumberで数値に変換

    if (event.target.checked) {
      setSelectedPrefs([...selectedPrefs, prefCode])
      //selectedPrefs の配列をコピー（...selectedPrefs）して、新しい prefCode を追加！
      fetchPopulationData(prefCode)
    } else {
      setSelectedPrefs(
        selectedPrefs.filter((selectedPref) => selectedPref !== prefCode)
      )
      //prefCodeでないものを消す
    }
  }

  // チェックボックスで選択された都道府県のデータを統合し、グラフに渡すためのデータを作成する
  useEffect(() => {
    // console.log('現在の populationData:', populationData)
    // console.log('現在の selectedPrefs:', selectedPrefs)
    if (selectedPrefs.length === 0) {
      setMergedData([]) // チェックがない場合は空配列
      return
    }

    console.log('現在の selectedPrefs:', selectedPrefs)
    console.log('現在の populationData:', populationData)

    const mergedData =
      populationData[selectedPrefs[0]]?.data
        ?.find((category) => category.label === '総人口')
        ?.data.map((yearData) => {
          // console.log('🔍 item の構造:', item) // item の中身を確認
          // console.log('🟢 item.year:', item?.year) // item.year を確認
          const newData: { [key: string]: number | string } = {
            year: yearData.year,
          } // 年を追加

          //選択された都道府県ごとに "総人口" のデータを取得する処理
          selectedPrefs.forEach((selectedPref) => {
            // console.log(`現在の ${selectedPref} のデータ:`, populationData[selectedPref]?.data);
            // console.log(`現在処理中の都道府県コード:`, selectedPref)
            const popData = populationData[selectedPref]?.data?.find(
              (category) => category.label === selectedCategory
            )?.data //dataがあったらpopDataに入る
            // console.log('現在の総人口データ:', popData)
            if (popData) {
              // console.log(
              //   'popData の year 一覧:',
              //   popData.map((p) => p.year),
              // )
              // console.log(`item.year: ${item.year}`)
              const matchedYearData = popData.find(
                (p) => p.year === yearData.year
              )
              // console.log(`年 ${item.year} のデータ:`, yearData)
              //popDataのp.yearとitem.yearが同じだったら格納する

              // if (!yearData) {
              //   console.log(
              //     `⚠️ yearData が見つかりませんでした: item.year = ${item.year}`,
              //   )
              // }
              newData[
                prefectures.find((p) => p.prefCode === selectedPref)
                  ?.prefName || '不明'
              ] = matchedYearData ? matchedYearData.value : 0
            }
          })
          return newData
        }) || []

    console.log('現在の mergedData:', mergedData)

    setMergedData(mergedData)

    // 都道府県名リストを更新
    setSelectedPrefNames(
      selectedPrefs.map(
        (prefCode) =>
          prefectures.find((p) => p.prefCode === prefCode)?.prefName || '不明'
      )
    )
  }, [selectedPrefs, populationData, selectedCategory])

  const populationCategories = [
    '総人口',
    '年少人口',
    '生産年齢人口',
    '老年人口',
  ]

  return (
    <div>
      <h2>都道府県の選択</h2>
      <div className='prefecture-list'
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', // 自動調整のグリッド
          gap: '8px', // 各都道府県の間隔
          maxWidth: '1000px',
          margin: '0 auto', // 中央寄せ
        }}
      >
        {prefectures.map((prefecture) => (
          <label key={prefecture.prefCode}>
            <label
              key={prefecture.prefCode}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px',
                borderRadius: '4px',
                transition: 'background 0.2s',
              }}
            ></label>
            <input
              type="checkbox"
              value={prefecture.prefCode}
              onChange={handleCheckboxChange}
            />
            {prefecture.prefName}
          </label>
        ))}
      </div>
      <h3>人口の種類</h3>
      <div className='radio-group'>
        {populationCategories.map((category) => (
          <label key={category}>
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
      <h3>選択中の都道府県：</h3>
      <p>
        {selectedPrefs.length > 0
          ? //一つで選択されていたら
            selectedPrefs
              .map(
                (selectedPref) =>
                  prefectures.find(
                    (prefecture) => prefecture.prefCode === selectedPref
                  )?.prefName
                //prefectures のリストを 1つずつ調べる
                //pref.prefCode と selectedPref（チェックされたID）を比較
                //一致したら pref を返す！
                //?.は、「もし undefined ならエラーを出さずに undefined を返す」
              )
              .join(', ')
          : 'なし'}
      </p>
    </div>
  )
}

export default PrefectureCheckboxList
