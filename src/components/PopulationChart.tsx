// PopulationChart.tsx(グラフの描写)

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

type PrefectureData = {
  year: number
  [prefName: string]: number
}

type Props = {
  data: PrefectureData[]
  selectedPrefNames: string[]
}

const PopulationChart = ({ data, selectedPrefNames }: Props) => {
  console.log('🔍 Chart Data:', data)
  console.log('🔍 Selected Pref Names:', selectedPrefNames)

  return (
    <div className="chart-container">
      <h3>人口推移データ</h3>
      {data.length === 0 ? (
        <p>データがありません</p> // ✅ データがない場合のエラーハンドリング
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 90, bottom: 30 }}
          >
            <XAxis dataKey="year" stroke="#ffffff" />
            <YAxis
              stroke="#ffffff"
              width={80}
              tickFormatter={(value) => value.toLocaleString()}
              allowDecimals={false}
            />
            <Tooltip />
            <Legend />
            {selectedPrefNames.map((selectedPrefName, index) =>
              data.some((entry) => selectedPrefName in entry) ? ( // ✅ データにその都道府県が含まれているか確認
                <Line
                  key={selectedPrefName}
                  type="monotone"
                  dataKey={selectedPrefName}
                  stroke={
                    ['#8884d8', '#82ca9d', '#ff7300', '#ffc658'][index % 4]
                  }
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default PopulationChart
