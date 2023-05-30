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
        <text
          x="50%"
          y="20"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            fill: props.titleColor,
          }}
        >
          {props.title}
        </text>
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
        <Legend
          formatter={(label) => {
            return (
              <span
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "700",
                }}
              >
                {label}
              </span>
            );
          }}
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MyPieChart;
