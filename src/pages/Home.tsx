import { Stack, Text, Tooltip } from "@mantine/core";
import { icons } from "../app-icons";
import "./Home.css";

const Home = () => {
  const myDiv = (key: string) =>
    <div key={key} className="event-div">
      {icons.bookmark}
    </div>;
  const getTooltip = (i: number) =>
    <Stack spacing="xs">
      <Text>Your birth day</Text>
      <Text>The index is {i}</Text>
      <Text>The index is {i}</Text>
    </Stack>;

  return (
    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
      {
        [...Array(1000)].map((_, i) =>
          <Tooltip
            key={`tooltip-${i}`}
            label={getTooltip(i)}>
            {myDiv(i.toString())}
          </Tooltip>
        )
      }
    </div>
  );
};

export default Home;
