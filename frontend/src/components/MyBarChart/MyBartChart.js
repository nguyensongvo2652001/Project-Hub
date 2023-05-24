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
        <text
          x="50%"
          y="20"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            fill: props.barColor,
          }}
        >
          {props.title}{" "}
        </text>
        <XAxis dataKey="name" />

        <YAxis padding={{ top: 50 }} />
        <CartesianGrid stroke="#ccc" />
        <Bar dataKey="value" fill={props.barColor} />
        <Legend
          formatter={(_) => {
            return (
              <span
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "700",
                }}
              >
                {props.label}
              </span>
            );
          }}
        />
        <Tooltip />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MyBarChart;
