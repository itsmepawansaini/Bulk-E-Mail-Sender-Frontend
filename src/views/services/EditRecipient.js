/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify'; // Ensure you have toast imported
import { fetchRecipientGroup } from '../../slices/recipientSlice';

const EditRecipientModal = ({ show, onHide, onUpdate, recipient }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show && recipient) {
      setName(recipient.name || '');
      setEmail(recipient.email || '');
      setSelectedGroups(recipient.groups ? recipient.groups.map((group) => ({ value: group._id, label: group.name })) : []);
    }
  }, [show, recipient]);

  useEffect(() => {
    dispatch(fetchRecipientGroup())
      .unwrap()
      .then((response) => {
        setAllGroups(response.map((group) => ({ value: group._id, label: group.name })));
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed To Fetch Recipient Groups.');
      });
  }, [dispatch]);

  const handleUpdate = async () => {
    if (!name || !email) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);
    try {
      await onUpdate({ id: recipient._id, name, email, groups: selectedGroups.map((group) => group.value) });
      onHide();
    } catch (error) {
      console.error('Error updating recipient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onHide();
  };

  const handleGroupChange = (selectedOptions) => {
    setSelectedGroups(selectedOptions || []);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Recipient Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="editRecipientName">
            <Form.Label>Name</Form.Label>
            <Form.Control required type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="editRecipientEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control required type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Groups</Form.Label>
            <Select options={allGroups} value={selectedGroups} onChange={handleGroupChange} isMulti placeholder="Select Groups" />
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

export default EditRecipientModal;
