/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';

const EditSenderModal = ({ show, onHide, onUpdate, sender }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sender) {
      setName(sender.name || '');
      setEmail(sender.email || '');
    }
  }, [sender]);

  const handleUpdate = async () => {
    if (!name || !email) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);
    try {
      await onUpdate({ id: sender._id, name, email });
      onHide();
    } catch (error) {
      console.error('Error updating sender:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(''); // Clear any existing error message
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Sender Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="editSenderName">
            <Form.Label>Name</Form.Label>
            <Form.Control required type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="editSenderEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control required type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
          {error && (
            <Alert className="mt-3" variant="danger">
              {error}
            </Alert>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button onClick={handleUpdate} variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Loading...
            </>
          ) : (
            'Update'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSenderModal;
