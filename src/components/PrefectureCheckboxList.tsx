import { useState, useEffect } from "react"

type Prefecture = {
    prefCode: number;
    prefName: string;
}

const PrefectureCheckboxList =() => {
    const [ prefectures, setPrefectures ] = useState<Prefecture[]>([])

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
    }, []);

    return (
        <div>
            <h2>都道府県の選択</h2>
            <div>
                {prefectures.map((prefecture) => (
                      <label key={prefecture.prefCode}>
                        <input type="checkbox" value={prefecture.prefName}/> 
                        {prefecture.prefName}
                      </label>
                ))}
            </div>
        </div>
    )
}

export default PrefectureCheckboxList