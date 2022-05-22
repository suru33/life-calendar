import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import Home from "./pages/Home";
import Config from "./pages/Config";
import AppHeader from "./components/AppHeader";

const App = () =>
  <MantineProvider withGlobalStyles>
    <ModalsProvider>
      <AppShell fixed header={<AppHeader/>}>
        <Routes>
          <Route path="/">
            <Route key="74df" index element={<Navigate to="home" replace/>}/>
            <Route key="ea39" path="home" element={<Home/>}/>
            <Route key="fe64" path="config" element={<Config/>}/>
          </Route>
        </Routes>
      </AppShell>
    </ModalsProvider>
  </MantineProvider>;
export default App;
