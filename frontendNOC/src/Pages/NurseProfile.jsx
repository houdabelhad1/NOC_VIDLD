import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NurseProfile.css";
import axios from "axios";

const NurseProfile = () => {
  const { id } = useParams();
  const [nurse, setNurse] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    const fetchNurse = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/nurse-service/api/nurses/${id}`);
        setNurse(response.data);
      } catch (error) {
        console.error("Error fetching nurse data:", error);
      }
    };

    fetchNurse();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // ID du patient (à remplacer par une vraie valeur dynamique plus tard)
      const patientId = 1; 
      
      const response = await axios.post(
        "http://localhost:8085/appointment-service/api/appointments",
        {
          nurseId: id,
          patientId: patientId,
          date: selectedDate,
          time: selectedTime
        }
      );

      if (response.status === 200) {
        alert("Rendez-vous créé avec succès !");
        // Réinitialiser le formulaire
        setSelectedDate("");
        setSelectedTime("");
      }
    } catch (error) {
      console.error("Erreur lors de la création du rendez-vous:", error);
      alert("Erreur lors de la réservation. Vérifiez la console pour plus de détails.");
    }
  };

  if (!nurse) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="my-5">
      <Row className="h-100">
        <Col md={4} className="d-flex">
          <Card className="w-100">
            <Card.Img
              variant="top"
              src="/placeholder.svg?height=300&width=300"
              alt="Nurse's photo"
              className="card-img-top"
            />
            <Card.Body>
              <Card.Title>{nurse.name}</Card.Title>
              <Card.Text>
                Phone: {nurse.phoneNumber}
                <br />
                City: {nurse.geographicArea}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <h2 className="mb-4">Reserve an Appointment</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Select Date</Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Select Time</Form.Label>
              <Form.Control
                as="select"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
              >
                <option value="">Choose a time...</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">01:00 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="17:00">05:00 PM</option>
                <option value="18:00">06:00 PM</option>
                <option value="19:00">07:00 PM</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit Reservation
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default NurseProfile;