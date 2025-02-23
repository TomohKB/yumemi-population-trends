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
  return (
    <div>
      <h3>人口推移データ</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="year" stroke="#ffffff" /> {/* X軸のラベルを白に */}
          <YAxis stroke="#ffffff" /> {/* Y軸のラベルを白に */}
          <Tooltip />
          <Legend />
          {selectedPrefNames.map((selectedPrefName, index) => (
            <Line
              key={selectedPrefName}
              type="monotone"
              dataKey={selectedPrefName}
              stroke={['#8884d8', '#82ca9d', '#ff7300'][index % 3]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PopulationChart
