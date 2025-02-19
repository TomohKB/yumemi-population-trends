import { useState, useEffect } from "react"

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

  //checkboxのOn,Offを切り替える
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const prefCode = Number(event.target.value)
    //チェックされた <input> タグの value を取得する
    // valueは文字列だからNumberで数値に変換

    if (event.target.checked) {
      setselectedPrefs([...selectedPrefs, prefCode])
      //selectedPrefs の配列をコピー（...selectedPrefs）して、新しい prefCode を追加！
      //
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
              ).join(', ')
          : 'なし'}
      </p>
    </div>
  )
}

export default PrefectureCheckboxList