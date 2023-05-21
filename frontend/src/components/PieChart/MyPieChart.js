import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

const MyPieChart = (props) => {
  return (
    <ResponsiveContainer width={props.width} height={props.height}>
      <PieChart className={props.className}>
        <Pie
          dataKey="value"
          data={props.data}
          outerRadius={100}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {props.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MyPieChart;
