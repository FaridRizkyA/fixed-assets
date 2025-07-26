import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PengadaanAset from './pages/PengadaanAset';
import PrivateRoute from './components/PrivateRoute';
import PenempatanAset from './pages/PenempatanAset';
import PenyusutanAset from './pages/PenyusutanAset';
import PenghapusanAset from './pages/PenghapusanAset';
import ManajemenUser from './pages/ManajemenUser';
import DokumenAset from './pages/DokumenAset';
import CetakRiwayatPenyusutan from './pages/print/CetakRiwayatPenyusutan';
import CetakRingkasanPenyusutan from "./pages/print/CetakRingkasanPenyusutan";
import CetakDaftarAset from './pages/print/CetakDaftarAset';
import CetakPenempatanAset from './pages/print/CetakPenempatanAset';
import CetakPenghapusanAset from './pages/print/CetakPenghapusanAset';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/pengadaan"
          element={
            <PrivateRoute>
              <PengadaanAset />
            </PrivateRoute>
          }
        />
        <Route
          path="/penempatan"
          element={
            <PrivateRoute>
              <PenempatanAset />
            </PrivateRoute>
          }
        />
        <Route
          path="/penyusutan"
          element={
            <PrivateRoute>
              <PenyusutanAset />
            </PrivateRoute>
          }
        />
        <Route
          path="/penghapusan"
          element={
            <PrivateRoute>
              <PenghapusanAset />
            </PrivateRoute>
          }
        />
        <Route
          path="/print/riwayatPenyusutan"
          element={ <CetakRiwayatPenyusutan /> }
        />
        <Route
          path="/print/penempatanAset"
          element={ <CetakPenempatanAset /> }
        />
        <Route
          path="/print/ringkasanPenyusutan"
          element={ <CetakRingkasanPenyusutan /> }
        />
        <Route
          path="/print/pengadaanAset"
          element={ <CetakDaftarAset /> }
        />
        <Route
          path="/print/penghapusanAset"
          element={ <CetakPenghapusanAset /> }
        />
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <ManajemenUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/dokumen"
          element={
            <PrivateRoute>
              <DokumenAset />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
