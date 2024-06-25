/* eslint-disable prefer-destructuring */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { fetchAllRecipients } from '../../slices/recipientSlice';

const AddRecipientByGroup = ({ show, onHide, onAdd, data }) => {
  console.log(data);
  const dispatch = useDispatch();
  const id = data?._id;
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [allRecipients, setAllRecipients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      dispatch(fetchAllRecipients())
        .then((response) => {
          setAllRecipients(response?.payload?.recipients);
        })
        .catch((error) => {
          console.error(error);
          setError('Failed to fetch recipients.');
        });
    }
  }, [show]);

  const handleAdd = async () => {
    if (selectedRecipients.length === 0) {
      setError('Please select at least one recipient.');
      return;
    }

    setLoading(true);
    try {
      const recipientIds = selectedRecipients.map((recipient) => recipient.value);
      await onAdd({ recipientIds, groupId: id });
      setSelectedRecipients([]);
      onHide();
    } catch (error) {
      console.error('Error adding recipients to group:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onHide();
  };

  const recipientOptions = allRecipients
    .filter((recipient) => !data?.recipients.some((r) => r._id === recipient._id))
    .map((recipient) => ({
      value: recipient._id,
      label: recipient.name,
    }));

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Recipients to Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="selectRecipients">
            <Form.Label>Recipients</Form.Label>
            <Select options={recipientOptions} isMulti value={selectedRecipients} onChange={setSelectedRecipients} placeholder="Select recipients" />
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
        <Button onClick={handleAdd} variant="primary" disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Loading...
            </>
          ) : (
            'Add'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRecipientByGroup;
