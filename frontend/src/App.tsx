import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IssuerTemplateCreator } from "./components/template/IssuerTemplateCreator";
import { IssueCredential } from "./components/IssueCredential/IssueCredential";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<div>Vite App</div>} />
          <Route
            path="/IssuerTemplateCreator"
            element={<IssuerTemplateCreator />}
          />
          <Route path="/issueCredential" element={<IssueCredential />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
        />
      </>
    </Router>
  );
}

export default App;
