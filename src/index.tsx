/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

import "./index.css";
import App from "./App";

render(
  () => (
    <>
      <header class="app__header">{/* navigation */}</header>
      <main class="app__body">
        <Router>
          <App />
        </Router>
      </main>
      <footer class="app__footer">{/* footer */}</footer>
    </>
  ),
  document.getElementById("root") as HTMLElement
);
