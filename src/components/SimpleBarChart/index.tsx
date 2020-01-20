import React from 'react'
import { SampleGraphData } from '../../@types/exercise-type'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

interface Props {
  items: SampleGraphData[]
}

const SimpleBarChart: React.FC<Props> = ({ items }) => {
  return (
    <BarChart
      width={500}
      height={300}
      data={items}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="pv" fill="#8884d8" />
      <Bar dataKey="uv" fill="#82ca9d" />
    </BarChart>
  )
}

export default SimpleBarChart
