import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IssuerTemplateCreator } from "./components/template/IssuerTemplateCreator";
import { IssueCredential } from "./components/IssueCredential/IssueCredential";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { Navigation } from "./components/Navigation";
import { Verification } from "./components/verification/Verification";
import { RecipientDashboard } from "./components/Recipient/RecipientView";

function App() {
  const url = new URL(window.location.href);
  const hideHomeNaivation = url.pathname === "/";
  return (
    <Router>
      <>
        {!hideHomeNaivation && (
          <div className="home-button-container">
            <a className="go-to-home" href="/">
              Home
            </a>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Navigation />} />

          <Route path="/createTemplate" element={<IssuerTemplateCreator />} />

          <Route path="/issueCredential" element={<IssueCredential />} />

          <Route path="/verification" element={<Verification />} />

          <Route path="/recipientView" element={<RecipientDashboard />} />
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
