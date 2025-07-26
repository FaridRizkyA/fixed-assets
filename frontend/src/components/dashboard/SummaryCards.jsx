import React from "react";
import { Card, Col, Row } from "react-bootstrap";

function SummaryCards({ data }) {
  const formatRupiah = (number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);

  const cardData = [
    { title: "Total Aset", value: data.totalAssets, backGround: "primary" },
    { title: "Total Nilai Aset", value: formatRupiah(data.totalValue), backGround: "success" },
    { title: "Total Penyusutan", value: formatRupiah(data.totalDepreciation), backGround: "warning" },
    { title: "Aset Dihapuskan", value: data.totalDisposed, backGround: "danger" },
  ];

  return (
    <Row className="g-4">
      {cardData.map((item, idx) => (
        <Col md={6} lg={3} key={idx}>
          <Card className="shadow-sm border-0">
            <Card.Body className={`text-white bg-${item.backGround} rounded`}>
                <Card.Title className="mb-2 fs-6">{item.title}</Card.Title>
                <Card.Text className="fs-5">{item.value}</Card.Text>
            </Card.Body>
        </Card>
        </Col>
      ))}
    </Row>
  );
}

export default SummaryCards;