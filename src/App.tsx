import "./App.css";
import { Routes, Route, Outlet } from "react-router";
import SearchPage from "./pages/search-page";
import Layout from "./components/Layout";
import { SearchResultPage } from "./pages/search-result-page";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<SearchPage />} />
        <Route path="/search/:nickname" element={<SearchResultPage />} />
      </Route>
    </Routes>
  );
}

export default App;
