// SearchPageLayout.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import SearchPage from "./components/SearchPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SearchPageLayout.css";

export function SearchPageLayout() {
  return (
    <div className="layout-container">
      <Routes>
        <Route path="/" element={<SearchPage />} />
      </Routes>
    </div>
  );
}