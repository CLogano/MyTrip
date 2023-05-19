import React, { Fragment } from "react";
import Home from "./layout/home/Home";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./layout/destinations/Dashboard";
import Header from "./layout/header/Header";

function App() {
  return (
    <Fragment>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Dashboard />} />
      </Routes>
    </Fragment>
  );
}

export default App;