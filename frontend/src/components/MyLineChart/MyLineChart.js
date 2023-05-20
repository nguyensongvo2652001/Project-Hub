import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const MyLineChart = (props) => {
  return (
    <LineChart width={props.width} height={props.height} data={props.data}>
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <Line
        type="monotone"
        dataKey="value"
        stroke={props.color}
        strokeWidth={3}
      />
      <Tooltip />
      <Legend
        formatter={(_) => {
          return props.label;
        }}
      />
    </LineChart>
  );
};

export default MyLineChart;
