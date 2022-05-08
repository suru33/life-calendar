import { useState } from "react";
import { AppShell, ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import AppHeader from "./components/AppHeader";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Config from "./pages/Config";

const App = () => {
  const [ colorScheme, setColorScheme ] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const appTheme = {
    colorScheme: colorScheme
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={appTheme} withGlobalStyles>
        <AppShell
          fixed
          header={
            <AppHeader
              colorScheme={colorScheme}
              colorSchemeToggleFn={toggleColorScheme}/>
          }>
          <Routes>
            <Route path="/">
              <Route index element={<Navigate to="home" replace/>}/>
              <Route path="home" element={<Home/>}/>
              <Route path="config" element={<Config/>}/>
            </Route>
          </Routes>
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
export default App;
