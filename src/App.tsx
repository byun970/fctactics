import "./App.css";
import { Routes, Route, Outlet } from "react-router";
import IndexPage from "./pages/index-page";
import SearchPage from "./pages/search-page";
import { TierListPage } from "./pages/tier-list-page";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<SearchPage />} />
        <Route path="/tierlist" element={<TierListPage />} />
      </Route>
    </Routes>
  );
}

export default App;
