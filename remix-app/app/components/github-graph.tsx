import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  ResponsiveContainerProps,
  XAxis,
  YAxis,
} from "recharts";
import { token } from "styled-system/tokens";
import { getGithubContributes } from "~/loader/getGithubContributes";

interface Props extends Omit<ResponsiveContainerProps, "children"> {}

export function GithubGraph(props: Props) {
  const data = getGithubContributes();
  const max = Math.max(...data.map((d) => d.amt));
  const min = Math.min(...data.map((d) => d.amt));

  return (
    <ResponsiveContainer width="100%" height="30%" {...props}>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 5,
        }}
      >
        <defs>
          <filter id="drop-shadow">
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#fff" />
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#fff" />
          </filter>
        </defs>
        <Line
          type="monotone"
          dataKey="amt"
          stroke={token("colors.violet.300")}
          dot={false}
          isAnimationActive
          style={{
            filter: "url(#drop-shadow)",
          }}
        />
        <XAxis dataKey="month" />
        <ReferenceLine
          y={max}
          stroke={token("colors.zinc.300")}
          strokeOpacity={0.3}
          strokeDasharray="3 3"
          label={{
            value: max,
            position: "insideBottomRight",
          }}
        />
        <ReferenceLine
          y={min}
          stroke={token("colors.zinc.300")}
          strokeOpacity={0.3}
          strokeDasharray="3 3"
          label={{
            value: min,
            position: "insideTopRight",
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
