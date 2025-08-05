import React, { useState, useEffect } from 'react';
import SummaryCards from "../components/dashboard/SummaryCards";
import CategoryChart from "../components/dashboard/charts/CategoryChart";
import DepreciationChart from "../components/dashboard/charts/DepreciationChart";
import AssetsValueChart from "../components/dashboard/charts/AssetsValueChart";
import DisposalChart from "../components/dashboard/charts/DisposalChart";
import AssetsHistoryTable from "../components/dashboard/AssetsHistoryTable";
import { Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

function Dashboard() {
  const [summary, setSummary] = useState({
    totalAssets: 0,
    totalValue: 0,
    totalDepreciation: 0,
    totalDisposed: 0
  });

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + "/api/summary");
        setSummary(res.data);
      } catch (err) {
        console.error("Gagal mengambil data summary:", err);
      }
    }
    fetchSummary();
  }, []);

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return null;

  return (
    <>
      <SummaryCards data={summary} />

      <Row className="mt-0 g-4">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body style={{ height: '300px' }}>
              <CategoryChart />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body style={{ height: '300px' }}>
              <DepreciationChart />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body style={{ height: '300px' }}>
              <AssetsValueChart />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body style={{ height: '300px' }}>
              <DisposalChart />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <AssetsHistoryTable />

    </>
  );
}

export default Dashboard;
