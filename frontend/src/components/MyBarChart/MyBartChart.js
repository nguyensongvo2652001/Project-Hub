import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MyBarChart = (props) => {
  return (
    <ResponsiveContainer width={props.width} height={props.height}>
      <BarChart data={props.data}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid stroke="#ccc" />
        <Bar dataKey="value" fill={props.barColor} />
        <Legend
          formatter={(_) => {
            return props.label;
          }}
        />
        <Tooltip />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MyBarChart;
