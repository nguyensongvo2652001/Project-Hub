import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

const MyPieChart = (props) => {
  return (
    <PieChart
      width={props.width}
      height={props.width}
      className={props.className}
    >
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
  );
};

export default MyPieChart;
