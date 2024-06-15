"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Modal, Form, Card, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const HomePage = () => {
  const [packetName, setPacketName] = useState('');
  const [description, setDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [nameList, setNameList] = useState(JSON.parse(localStorage.getItem('nameList')) || []);
  const [descriptionList, setDescriptionList] = useState(JSON.parse(localStorage.getItem('descriptionList')) || {});

  useEffect(() => {
    localStorage.setItem('nameList', JSON.stringify(nameList));
    localStorage.setItem('descriptionList', JSON.stringify(descriptionList));
  }, [nameList, descriptionList]);

  const handleClose = () => {
    setShowModal(false);
    setPacketName('');
    setDescription('');
    setEditMode(false);
    setCurrentEditIndex(null);
  };
  const handleShow = () => setShowModal(true);

  const handleInput = (e) => setPacketName(e.target.value);
  const handleDescription = (e) => setDescription(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode && currentEditIndex !== null) {
      const updatedNameList = [...nameList];
      const updatedDescriptionList = { ...descriptionList };
      const oldPacketName = updatedNameList[currentEditIndex];
      updatedNameList[currentEditIndex] = packetName;
      updatedDescriptionList[packetName] = description;
      delete updatedDescriptionList[oldPacketName];
      setNameList(updatedNameList);
      setDescriptionList(updatedDescriptionList);
    } else {
      setNameList([...nameList, packetName]);
      setDescriptionList({ ...descriptionList, [packetName]: description });
      localStorage.setItem(`vocabList_${packetName}`, JSON.stringify([])); 
    }
    setPacketName('');
    setDescription('');
    handleClose();
  };

  const handleDelete = (name) => {
    const updatedNameList = nameList.filter((setName) => setName !== name);
    setNameList(updatedNameList);
    const updatedDescriptionList = { ...descriptionList };
    delete updatedDescriptionList[name];
    setDescriptionList(updatedDescriptionList);
    localStorage.removeItem(`vocabList_${name}`);
  };

  const handleEdit = (index) => {
    setPacketName(nameList[index]);
    setDescription(descriptionList[nameList[index]]);
    setCurrentEditIndex(index);
    setEditMode(true);
    setShowModal(true);
  };

  return (
    <Container>
      <div className="description bg-light text-dark p-3 mb-4">
        <div className="container">
          <h2>Make your flashcards here!</h2>
          <p>
            Add your card set over here. Afterwards, you can start adding cards in your set!
          </p>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Set' : 'Add Set'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Set Name</Form.Label>
              <Form.Control
                type="text"
                value={packetName}
                onChange={handleInput}
                placeholder="Enter set name"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={description}
                onChange={handleDescription}
                placeholder="Describe what these flashcards cover"
                style={{ marginTop: '10px' }}
                required
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={!packetName || !description}>
                {editMode ? 'Update' : 'Submit'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {nameList.length > 0 ? (
        <Row className="card-container">
          {nameList.map((name, index) => (
            <Col key={index} sm={12} md={4} className="mb-4">
              <Card className="h-100 d-flex flex-column">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="set-title">{name}</Card.Title>
                  <Card.Text className="card-description flex-grow-1">
                    {descriptionList[name]}
                  </Card.Text>
                  <div className="mt-auto d-flex justify-content-between">
                    <div>
                      <Link href={`/${name}`} passHref>
                        <Button variant="info" className="me-2">View Set</Button>
                      </Link>
                      <Button variant="warning" onClick={() => handleEdit(index)}>Edit</Button>
                    </div>
                    <Button variant="danger" onClick={() => handleDelete(name)}>Delete</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row className="justify-content-center mt-5">
          <Col sm={12} md={6} lg={4}>
            <Card className="text-center">
              <Card.Body>
                <Card.Text>Press "Add New Set" to get started.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <div className="fixed-bottom text-center mb-4">
        <Button className="add-new-set-button" onClick={handleShow}>
          Add New Set
        </Button>
      </div>

      <style jsx>{`
        .set-title {
          font-size: 1.5rem;
          font-family: 'Arial', sans-serif;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .card-description {
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .card {
          border: 2px solid #f0f0f0;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .card:hover {
          transform: translateY(-10px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
        .fixed-bottom {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
        }
        .add-new-set-button {
          width: 1000px;
          height: 50px;
          font-size: 20px;
          background-color: #007bff;
          border-color: #007bff;
          color: white;
          transition: background-color 0.3s, color 0.3s;
        }
        .add-new-set-button:hover {
          background-color: white;
          color: black;
        }
      `}</style>
    </Container>
  );
};

export default HomePage;