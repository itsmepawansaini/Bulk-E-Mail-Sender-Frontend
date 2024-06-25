/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { Row, Col, Dropdown, Button, Form, Tooltip, OverlayTrigger, Card, Pagination, Modal, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { toast } from 'react-toastify';
import { addRecipientGroup, fetchRecipientGroup, deleteRecipientGroup, updateRecipientGroup, addRecipientByGroup } from '../../slices/recipientSlice';
import ConfirmationModal from './DeleteModal';
import EditRecipientModal from './EditRecipientGroup';
import AddRecipient from './AddRecipientByGroup';

const Recipient = () => {
  const title = 'Recipient Group';
  const description = 'Add Recipient Group';
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [uploadModal, setUploadModal] = useState(false);
  const recipients = useSelector((state) => state?.recipient?.arecipientsgroup);
  const totalPagesNo = useSelector((state) => state?.recipient?.arecipientsgroup?.totalPages);
  const status = useSelector((state) => state.recipient.status);

  const [name, setName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    dispatch(fetchRecipientGroup());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(addRecipientGroup({ name }))
      .unwrap()
      .then((response) => {
        // eslint-disable-next-line no-underscore-dangle
        if (response._id) {
          setLoading(false);
          toast.success('Added Successfully!');
          dispatch(fetchRecipientGroup());
          setUploadModal(false);
        } else {
          setLoading(false);
          toast.error('Failed To Add Group. Please Try Again.');
        }
        setName('');
      })
      .catch((error) => {
        setLoading(false);
        toast.error('Failed To Add Group. Please Try Again.');
      });
  };

  const renderSpinner = () => (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  const renderPaginationItems = () => {
    const totalPages = Math.ceil(recipients?.totalPages);
    return (
      <>
        {Array.from({ length: totalPages }).map((_, index) => (
          <Pagination.Item key={index + 1} active={currentPage === index + 1} onClick={() => setCurrentPage(index + 1)} className="shadow">
            {index + 1}
          </Pagination.Item>
        ))}
      </>
    );
  };

  const handleView = (recipient) => {
    setSelectedRecipient(recipient);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEdit = (recipient) => {
    setSelectedRecipient(recipient);
    setShowEditModal(true);
  };

  const handleAdd = (recipient) => {
    setSelectedRecipient(recipient);
    setShowAddModal(true);
  };

  const updateDetails = ({ id, name }) => {
    dispatch(updateRecipientGroup({ id, name }))
      .unwrap()
      .then((response) => {
        console.log(response);
        if (response?.message === 'Recipient Group Updated Successfully') {
          dispatch(fetchRecipientGroup());
          toast.success('Updated Successfully!');
        } else {
          toast.error('Failed Update. Please Try Again.');
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed To Update. Please try again.');
      })
      .finally(() => {
        setShowEditModal(false);
        setSelectedRecipient(null);
      });
  };

  const addRecipienttogroup = ({ recipientIds, groupId }) => {
    console.log({ recipientIds, groupId });
    dispatch(addRecipientByGroup({ recipientIds, groupId }))
      .unwrap()
      .then((response) => {
        console.log(response);
        if (response?.message === 'Recipients added to group successfully') {
          dispatch(fetchRecipientGroup());
          toast.success('Added Successfully!');
        } else {
          toast.error('Failed. Please Try Again.');
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed. Please try again.');
      })
      .finally(() => {
        setShowAddModal(false);
        setSelectedRecipient(null);
      });
  };

  const handleDelete = (sender) => {
    setSelectedRecipient(sender);
    setShowConfirmationModal(true);
  };

  const confirmDelete = () => {
    const id = selectedRecipient._id;

    dispatch(deleteRecipientGroup({ id }))
      .unwrap()
      .then((response) => {
        if (response?.message === 'Recipient Group Deleted Successfully') {
          dispatch(fetchRecipientGroup());
          toast.success('Deleted Successfully!');
        } else {
          toast.error('Failed Delete. Please Try Again.');
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed To Delete. Please try again.');
      })
      .finally(() => {
        setShowConfirmationModal(false);
      });
  };

  const closeModal = () => {
    setShowConfirmationModal(false);
    setSelectedRecipient(null);
  };

  return (
    <>
      <HtmlHead title={title} description={description} />
      <Col>
        <EditRecipientModal show={showEditModal} onHide={() => setShowEditModal(false)} onUpdate={updateDetails} recipientgroup={selectedRecipient} />
        <AddRecipient show={showAddModal} onHide={() => setShowAddModal(false)} onAdd={addRecipienttogroup} data={selectedRecipient} />
        <ConfirmationModal show={showConfirmationModal} onHide={closeModal} onConfirm={confirmDelete} senderName={selectedRecipient?.name} />
        <div className="page-title-container mb-3">
          <Row>
            <Col className="mb-2">
              <h1 className="mb-2 pb-0 display-4">{title}</h1>
              <div className="text-muted font-heading text-small">Dragée pudding topping caramels oat cake icing muffin pudding.</div>
            </Col>
            <Col xs="12" sm="auto" className="d-flex align-items-center justify-content-end">
              <Button variant="outline-primary" className="btn-icon btn-icon-start ms-1 w-100 w-md-auto" onClick={() => setUploadModal(true)}>
                <CsLineIcons icon="plus" /> <span>Add New</span>
              </Button>
            </Col>
          </Row>
        </div>

        <Row className="mb-3">
          <Col md="5" lg="3" xxl="2" className="mb-1">
            <div className="d-inline-block float-md-start me-1 mb-1 search-input-container w-100 shadow bg-foreground">
              <Form.Control type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

              <span className="search-magnifier-icon">
                <CsLineIcons icon="search" />
              </span>
              <span className="search-delete-icon d-none">
                <CsLineIcons icon="close" />
              </span>
            </div>
          </Col>
          <Col md="7" lg="9" xxl="10" className="mb-1 text-end">
            <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1">
              <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Export</Tooltip>}>
                <Dropdown.Toggle variant="foreground-alternate" className="dropdown-toggle-no-arrow btn btn-icon btn-icon-only shadow">
                  <CsLineIcons icon="download" />
                </Dropdown.Toggle>
              </OverlayTrigger>
              <Dropdown.Menu className="shadow dropdown-menu-end">
                <Dropdown.Item href="#">Copy</Dropdown.Item>
                <Dropdown.Item href="#">Excel</Dropdown.Item>
                <Dropdown.Item href="#">Cvs</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        {status === 'loading' ? (
          renderSpinner()
        ) : (
          <div className="mb-5">
            <Row className="g-0 h-100 align-content-center d-none d-md-flex ps-4 pe-3 mb-2 custom-sort">
              <Col md="1" className="d-flex flex-column pe-1 d-flex">
                <div className="text-muted text-small cursor-pointer sort">S NO.</div>
              </Col>
              <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
                <div className="text-muted text-small cursor-pointer sort">NAME</div>
              </Col>
              <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
                <div className="text-muted text-small cursor-pointer sort">TOTAL RECIPIENTS</div>
              </Col>
              <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
                <div className="text-muted text-small cursor-pointer sort">CREATED AT</div>
              </Col>
              <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
                <div className="text-muted text-small cursor-pointer sort">ACTION</div>
              </Col>
            </Row>

            {recipients &&
              recipients.map((recipient, index) => (
                <Card key={recipient.id} className="mb-2">
                  <Card.Body className="py-0 ps-4 pe-3 sh-14 sh-md-7">
                    <Row className="g-0 h-100 align-content-center cursor-default">
                      <Col xs="6" md="1" className="d-flex flex-column justify-content-center mb-1 mb-md-0 h-md-100 position-relative">
                        <div className="text-alternate">{(currentPage - 1) * itemsPerPage + index + 1}</div>
                      </Col>
                      <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-1 mb-md-0 h-md-100 position-relative">
                        <div className="text-alternate">{recipient?.name}</div>
                      </Col>
                      <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-1 mb-md-0 h-md-100 position-relative">
                        <div className="text-alternate">{recipient?.totalRecipients}</div>
                      </Col>
                      <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-1 mb-md-0 h-md-100 position-relative">
                        <div className="text-alternate">{new Date(recipient?.createdAt).toLocaleDateString('hi-IN')}</div>
                      </Col>
                      <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-5 w-md-auto">
                        <div className="text-muted text-small d-md-none">Action</div>
                        <div className="flex">
                          <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">View Details</Tooltip>}>
                            <div onClick={() => handleView(recipient)} className="btn  btn-outline-success btn-icon btn-icon-action btn-icon-start">
                              <CsLineIcons icon="eye" />
                            </div>
                          </OverlayTrigger>
                          <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Edit Details</Tooltip>}>
                            <div onClick={() => handleEdit(recipient)} className="btn  btn-outline-primary btn-icon btn-icon-action btn-icon-start">
                              <CsLineIcons icon="pen" />
                            </div>
                          </OverlayTrigger>
                          <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Add Recipients</Tooltip>}>
                            <div onClick={() => handleAdd(recipient)} className="btn  btn-outline-success btn-icon btn-icon-action btn-icon-start">
                              <CsLineIcons icon="plus" />
                            </div>
                          </OverlayTrigger>
                          <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Delete Group</Tooltip>}>
                            <div onClick={() => handleDelete(recipient)} className="btn btn-outline-danger btn-icon btn-icon-action btn-icon-start">
                              <CsLineIcons icon="bin" />
                            </div>
                          </OverlayTrigger>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
          </div>
        )}
      </Col>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Group Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecipient && (
            <div>
              <p>
                <strong>Group Name:</strong> {selectedRecipient?.name}
              </p>
              <p>
                <strong>Total Recipients:</strong> {selectedRecipient?.totalRecipients}
              </p>
              <p>
                <strong>Recipients: </strong>
                {selectedRecipient?.recipients && selectedRecipient.recipients.length > 0
                  ? selectedRecipient.recipients.map((group) => group.name).join(', ')
                  : '-'}
              </p>
              <p>
                <strong>Created At:</strong> {selectedRecipient?.createdAt && new Date(selectedRecipient?.createdAt).toLocaleString('en-IN')}
              </p>
              {selectedRecipient?.updatedAt && (
                <p>
                  <strong>Last Updated:</strong> {new Date(selectedRecipient?.updatedAt).toLocaleString('en-IN')}
                </p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal className="modal-right large" show={uploadModal} onHide={() => setUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">Add New Recipient</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex">
          <Card className="mb-5 w-100">
            <Card.Body>
              <Form className="mb-n3" onSubmit={handleSubmit}>
                <div className="mb-3 filled">
                  <CsLineIcons icon="tag" />
                  <Form.Control type="text" placeholder="Recipient Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="text-center">
                  <div className="shadow d-inline-block">
                    {/* <Button variant="primary" className="btn-icon btn-icon-end" size="lg" type="submit">
                      <span>Create</span>
                      <CsLineIcons icon="chevron-right" />
                    </Button> */}

                    <Button size="lg" type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Loading...
                        </>
                      ) : (
                        'Create'
                      )}
                    </Button>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Recipient;
