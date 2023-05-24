import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MyLineChart = (props) => {
  return (
    <ResponsiveContainer width={"100%"} height={props.height}>
      <LineChart data={props.data}>
        <text
          x="50%"
          y="20"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            fill: props.color,
          }}
        >
          {props.title}
        </text>
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
            return (
              <span
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "700",
                  fill: props.color,
                }}
              >
                {props.label}
              </span>
            );
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MyLineChart;
