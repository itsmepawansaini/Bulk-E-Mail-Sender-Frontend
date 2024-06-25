/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';

const EditRecipientGroupModal = ({ show, onHide, onUpdate, recipientgroup }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (recipientgroup) {
      setName(recipientgroup.name || '');
    }
  }, [recipientgroup]);

  const handleUpdate = async () => {
    if (!name) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);
    try {
      await onUpdate({ id: recipientgroup._id, name });
      onHide();
    } catch (error) {
      console.error('Error Updating Recipient Group:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="editSenderName">
            <Form.Label>Name</Form.Label>
            <Form.Control required type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
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

export default EditRecipientGroupModal;
