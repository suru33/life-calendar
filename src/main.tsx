import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { NotificationsProvider } from "@mantine/notifications";
import App from "./App";

const container = document.getElementById("root");
if(container === null) {
  document.body.innerText = "Failed to run app";
} else {
  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <NotificationsProvider>
        <App/>
      </NotificationsProvider>
    </BrowserRouter>
  );
}
