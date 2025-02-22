import { useState, useEffect } from "react"
import PopulationChart from "./PopulationChart"

type Prefecture = {
    prefCode: number;
    prefName: string;
}

const PrefectureCheckboxList =() => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [selectedPrefs, setselectedPrefs] = useState<number[]>([])
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
      },
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('取得したデータ:', data)
        setPrefectures(data.result)
        //data.resultの都道府県リストをsetPrefecturesに入れる
      })
      .catch((error) => console.error('データ取得の失敗:', error))
  }, [])

  const [populationData, setPopulationData] = useState<{
    [key: number]: { data: any[] } | undefined
  }>({})
  const fetchPopulationData = (prefCode: number) => {
    fetch(
      `https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear?prefCode=${prefCode}`, 
      {
        method: "GET",
        headers: {
          'X-API-KEY': import.meta.env.VITE_RESAS_API_KEY,
          'Content-Type': 'application/json',
        },
      },
    )
      .then((res) => res.json())
      .then((data) => {
        console.log({prefCode}, data);
        setPopulationData((prevData) => ({
          ...prevData, //すでにあるデータを維持
          [prefCode]: data.result, //新しいデータの追加
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
      setselectedPrefs([...selectedPrefs, prefCode])
      //selectedPrefs の配列をコピー（...selectedPrefs）して、新しい prefCode を追加！
      fetchPopulationData(prefCode)
    } else {
      setselectedPrefs(selectedPrefs.filter((selectedPref) => selectedPref !== prefCode))
      //prefCodeでないものを消す
    }
  }

  return (
    <div>
      <h2>都道府県の選択</h2>
      <div>
        {prefectures.map((prefecture) => (
          <label key={prefecture.prefCode}>
            <input
              type="checkbox"
              value={prefecture.prefCode}
              onChange={handleCheckboxChange}
            />
            {prefecture.prefName}
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
                    (prefecture) => prefecture.prefCode === selectedPref,
                  )?.prefName,
                //prefectures のリストを 1つずつ調べる
                //pref.prefCode と selectedPref（チェックされたID）を比較
                //一致したら pref を返す！
                //?.は、「もし undefined ならエラーを出さずに undefined を返す」
              )
              .join(', ')
          : 'なし'}
      </p>

      <h3>人口データ：</h3>
      {/* チェックがない時のメッセージ */}
      {selectedPrefs.length === 0 && <p>データ取得中...</p>}

      {/* 都道府県が表示されているときの表示 */}
      {selectedPrefs.map((selectedPref) => {
        const prefecture = prefectures.find(
          (prefecture) => prefecture.prefCode === selectedPref,
          //find() を使うと、一致する prefecture オブジェクトが取得できる
        ) // 都道府県情報を取得
        const population = populationData[selectedPref]?.data || [] // 選択した都道府県の人口データを取得
        //?.（オプショナルチェーン）を使い、データがない場合 undefined にする

        console.log('populationの値:', population)

        return (
          <div key={selectedPref}>
            <h4>{prefecture?.prefName}</h4> {/* 都道府県名を表示 */}
            {/* ?.はエラーを返した時、エラーにならなくなる  */}
            {/* {/* {population ? ( // データがある場合 */}
              {/* <ul>
                {population.map((category: any) => (
                  //populationは配列で、populationの中のcategoryっていう位置付け
                  <li key={category.label}>
                    {category.label}: {JSON.stringify(category.data)}
                    //カテゴリごとのデータを JSON 形式で文字列として表示する */}
                  {/* {/* </li> */}
                {/* ))} */} 
               {/* </ul> */}
            {population.length > 0 ? (
              <PopulationChart
                data={population.find((category) => category.label === "総人口")?.data || []}
                title={prefecture?.prefName || "不明"}
              />
            ) : (
              <p>データ取得中...</p> // データがまだ取得できていない場合
            )}
          </div>
        )
      })}
    </div>
  )
}

export default PrefectureCheckboxList