import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell, ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import Home from "./pages/Home";
import Config from "./pages/Config";
import AppHeader from "./components/AppHeader";

const App = () => {
  const [ colorScheme, setColorScheme ] = useLocalStorage<ColorScheme>({ key: "theme", defaultValue: "light" });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const appTheme = {
    colorScheme: colorScheme
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={appTheme} withGlobalStyles>
        <ModalsProvider>
          <AppShell
            fixed
            header={
              <AppHeader
                colorScheme={colorScheme}
                colorSchemeToggleFn={toggleColorScheme}/>
            }>
            <Routes>
              <Route path="/">
                <Route key="74df" index element={<Navigate to="home" replace/>}/>
                <Route key="ea39" path="home" element={<Home/>}/>
                <Route key="fe64" path="config" element={<Config/>}/>
              </Route>
            </Routes>
          </AppShell>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
export default App;
