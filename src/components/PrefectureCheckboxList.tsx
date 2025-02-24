import { useState, useEffect } from 'react'

type Prefecture = {
  prefCode: number
  prefName: string
}

type PopulationEntry = {
  year: number
  [key: string]: number | string
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
  setMergedData: (data: PopulationEntry[]) => void
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

  const [populationData, setPopulationData] = useState<PopulationData>({})
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
      setMergedData([] as PopulationEntry[]) // チェックがない場合は空配列
      return
    }

    console.log('現在の selectedPrefs:', selectedPrefs)
    console.log('現在の populationData:', populationData)

    // 選択された都道府県の人口データを統合する
    const mergedData: PopulationEntry[] =
      populationData[selectedPrefs[0]]?.data
        ?.find((category) => category.label === selectedCategory) // 選択された人口カテゴリ（例: 総人口）
        ?.data.map((yearData: PopulationDetail) => {
          // 各年のデータを格納するオブジェクトを作成
          const newData: PopulationEntry = {
            year: yearData.year, // 年を格納
          }

          // 選択された都道府県ごとにデータを取得し、格納する
          selectedPrefs.forEach((selectedPref) => {
            // 指定された都道府県のデータを取得
            const popData = populationData[selectedPref]?.data?.find(
              (category) => category.label === selectedCategory // ユーザーが選択した人口種別
            )?.data

            // データが存在する場合のみ処理
            if (popData) {
              // 該当する年のデータを取得
              const matchedYearData = popData.find(
                (p) => p.year === yearData.year
              )

              // 都道府県名を取得（prefCode から探す）
              const prefName =
                prefectures.find((p) => p.prefCode === selectedPref)
                  ?.prefName || '不明'

              // `matchedYearData` があれば値を格納、なければ 0 をセット
              newData[prefName] = matchedYearData ? matchedYearData.value : 0
            }
          })

          // 1年分のデータを返す
          return newData
        }) || [] // データがない場合は空配列を返す

    // デバッグ用ログ（コンソールで確認）
    console.log('現在の mergedData:', mergedData)

    // 統合したデータを `setMergedData` にセット
    setMergedData(mergedData)

    // 都道府県名リストを更新
    setSelectedPrefNames(
      selectedPrefs.map(
        (prefCode) =>
          prefectures.find((p) => p.prefCode === prefCode)?.prefName || '不明'
      )
    )
  }, [
    selectedPrefs,
    populationData,
    selectedCategory,
    prefectures,
    setMergedData,
    setSelectedPrefNames,
  ])

  const populationCategories = [
    '総人口',
    '年少人口',
    '生産年齢人口',
    '老年人口',
  ]

  return (
    <div>
      <h2>都道府県の選択</h2>
      <div
        className="prefecture-list"
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
      <div className="radio-group">
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
