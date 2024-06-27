/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { Row, Col, Dropdown, Button, Form, Tooltip, OverlayTrigger, Card, Pagination, Modal, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { toast } from 'react-toastify';
import * as Papa from 'papaparse';
import { addRecipient, fetchRecipient, fetchRecipientGroup, uploadRecipients, deleteRecipient, updateRecipient } from '../../slices/recipientSlice';
import ConfirmationModal from './DeleteModal';
import EditRecipientModal from './EditRecipient';
import ExportDropdown from './ExportRecipients';

const Recipient = () => {
  const title = 'Recipient';
  const description = 'Add Recipient';
  const dispatch = useDispatch();

  const [uploadModal, setUploadModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const recipients = useSelector((state) => state?.recipient?.arecipients?.recipients);
  const totalPagesNo = useSelector((state) => state?.recipient?.arecipients?.totalPages);
  const status = useSelector((state) => state.recipient.status);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [recipientGroups, setRecipientGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleItemClick = (count) => {
    setItemsPerPage(count);
  };

  useEffect(() => {
    dispatch(fetchRecipient({ search: searchQuery, count: itemsPerPage, page: currentPage }));
  }, [dispatch, searchQuery, currentPage, itemsPerPage]);

  useEffect(() => {
    dispatch(fetchRecipientGroup())
      .unwrap()
      .then((response) => {
        setRecipientGroups(response);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed To Fetch Recipient Groups.');
      });
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    dispatch(addRecipient({ name, email, groups: selectedGroups }))
      .unwrap()
      .then((response) => {
        setLoading(false);
        if (response === 'Recipient Added') {
          dispatch(fetchRecipient({ search: searchQuery, count: itemsPerPage, page: currentPage }));
          toast.success('Recipient Added Successfully!');
          setAddModal(false);
          setName('');
          setEmail('');
          setSelectedGroups([]);
        } else {
          toast.error('Failed To Add Recipient. Please Try Again.');
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error('Failed To Add Recipient. Please Try Again.');
      });
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmitCSV = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!selectedGroup) {
      setLoading(false);
      toast.error('Please select a recipient group.');
      return;
    }

    if (!csvFile) {
      setLoading(false);
      toast.error('Please Upload a CSV File.');
      return;
    }

    const formData = new FormData();
    formData.append('groupId', selectedGroup);
    formData.append('file', csvFile);

    dispatch(uploadRecipients(formData))
      .unwrap()
      .then((response) => {
        if (response === 'Recipients Uploaded Successfully') {
          setLoading(false);
          dispatch(fetchRecipient({ search: searchQuery, count: itemsPerPage, page: currentPage }));
          toast.success('Recipients Added Successfully!');
          setUploadModal(false);
        } else {
          setLoading(false);
          toast.error('Failed To Add Recipients. Please Try Again.');
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        toast.error('Failed to add recipients. Please try again.');
      });
  };

  const handleView = (recipient) => {
    setSelectedRecipient(recipient);
    setShowModal(true);
  };

  const handleRemoveGroup = (recipient) => {
    setSelectedRecipient(recipient);
    setRemoveModal(true);
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

  const handleDelete = (sender) => {
    setSelectedRecipient(sender);
    setShowConfirmationModal(true);
  };

  const confirmDelete = () => {
    const id = selectedRecipient._id;

    dispatch(deleteRecipient({ id }))
      .unwrap()
      .then((response) => {
        if (response?.message === 'Recipient Deleted Successfully') {
          dispatch(fetchRecipient({ search: searchQuery, count: itemsPerPage, page: currentPage }));
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

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEdit = (recipient) => {
    setSelectedRecipient(recipient);
    setShowEditModal(true);
  };

  const updateDetails = ({ id, name, email, groups }) => {
    dispatch(updateRecipient({ id, name, email, groups }))
      .unwrap()
      .then((response) => {
        if (response?.message === 'Recipient Updated Successfully') {
          dispatch(fetchRecipient({ search: searchQuery, count: itemsPerPage, page: currentPage }));
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

  return (
    <>
      <HtmlHead title={title} description={description} />
      <Col>
        <EditRecipientModal show={showEditModal} onHide={() => setShowEditModal(false)} onUpdate={updateDetails} recipient={selectedRecipient} />
        <ConfirmationModal show={showConfirmationModal} onHide={closeModal} onConfirm={confirmDelete} senderName={selectedRecipient?.name} />
        <div className="page-title-container mb-3">
          <Row>
            <Col className="mb-2">
              <h1 className="mb-2 pb-0 display-4">{title}</h1>
              <div className="text-muted font-heading text-small">Dragée pudding topping caramels oat cake icing muffin pudding.</div>
            </Col>
            <Col xs="12" sm="auto" className="d-flex align-items-center justify-content-end">
              <Button variant="outline-primary" className="btn-icon btn-icon-start ms-1 w-100 w-md-auto" onClick={() => setAddModal(true)}>
                <CsLineIcons icon="plus" /> <span>Add New</span>
              </Button>
              <Button variant="outline-primary" className="btn-icon btn-icon-start ms-1 w-100 w-md-auto" onClick={() => setUploadModal(true)}>
                <CsLineIcons icon="upload" /> <span>Add Via CSV</span>
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
            {/* <ExportDropdown searchQuery={searchQuery} /> */}

            <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1">
              <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Item Count</Tooltip>}>
                <Dropdown.Toggle variant="foreground-alternate" className="shadow sw-13">
                  {`${itemsPerPage} Items`}
                </Dropdown.Toggle>
              </OverlayTrigger>
              <Dropdown.Menu className="shadow dropdown-menu-end">
                <Dropdown.Item href="#" onClick={() => handleItemClick(5)}>
                  5 Items
                </Dropdown.Item>
                <Dropdown.Item href="#" onClick={() => handleItemClick(10)}>
                  10 Items
                </Dropdown.Item>
                <Dropdown.Item href="#" onClick={() => handleItemClick(20)}>
                  20 Items
                </Dropdown.Item>
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
                <div className="text-muted text-small cursor-pointer sort">EMAIL</div>
              </Col>
              <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
                <div className="text-muted text-small cursor-pointer sort">GROUPS</div>
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
                      <Col md="3" className="d-flex flex-column justify-content-center order-3 ms-5 ms-md-0">
                        <div className="text-alternate">{recipient?.email}</div>
                      </Col>
                      <Col md="3" className="d-flex flex-column justify-content-center order-4 ms-5 ms-md-0 ">
                        <div className="text-alternate">{recipient?.groups && recipient.groups.length}</div>
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

        <div className="d-flex justify-content-center">
          <Pagination>
            <Pagination.Prev className="shadow" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              <CsLineIcons icon="chevron-left" />
            </Pagination.Prev>
            {/* Render pagination items based on total pages */}
            {renderPaginationItems()}
            <Pagination.Next className="shadow" onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage === totalPagesNo}>
              <CsLineIcons icon="chevron-right" />
            </Pagination.Next>
          </Pagination>
        </div>
      </Col>

      <Modal className="modal-right large" show={addModal} onHide={() => setAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">Add New Recipient</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex">
          <Card className="mb-5 w-100">
            <Card.Body>
              <Form className="mb-n3" onSubmit={handleSubmit}>
                <div className="mb-3 filled">
                  <CsLineIcons icon="box" />
                  <Form.Group controlId="recipientGroupSelect">
                    <Form.Control
                      as="select"
                      multiple
                      value={selectedGroups}
                      onChange={(e) => setSelectedGroups(Array.from(e.target.selectedOptions, (option) => option.value))}
                    >
                      {recipientGroups.map((group) => (
                        <option key={group._id} value={group._id}>
                          {group.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="mb-3 filled">
                  <CsLineIcons icon="user" />
                  <Form.Control type="text" placeholder="Recipient Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3 filled">
                  <CsLineIcons icon="email" />
                  <Form.Control type="email" placeholder="Recipient Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="text-center">
                  <div className="shadow d-inline-block">
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

      <Modal className="modal-right large" show={uploadModal} onHide={() => setUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">Add New Recipients via CSV</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex">
          <Card className="mb-5 w-100">
            <Card.Body>
              <Form className="mb-n3" onSubmit={handleSubmitCSV}>
                <div className="mb-3 filled">
                  <CsLineIcons icon="box" />
                  <Form.Group controlId="recipientGroupSelect">
                    <Form.Control as="select" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                      <option value="">Select a group</option>
                      {recipientGroups.map((group) => (
                        <option key={group._id} value={group._id}>
                          {group.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="mb-3 filled">
                  <CsLineIcons icon="upload" />
                  <Form.Group controlId="csvFileUpload">
                    <Form.Control type="file" accept=".csv" onChange={handleFileChange} />
                  </Form.Group>
                </div>
                <div className="text-center">
                  <div className="shadow d-inline-block">
                    {/* <Button variant="primary" className="btn-icon btn-icon-end" size="lg" type="submit">
                      <span>Upload</span>
                      <CsLineIcons icon="chevron-right" />
                    </Button> */}
                    <Button size="lg" type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Loading...
                        </>
                      ) : (
                        'Upload'
                      )}
                    </Button>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Recipient Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecipient && (
            <div>
              <p>
                <strong>Name:</strong> {selectedRecipient?.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedRecipient?.email}
              </p>
              <p>
                <strong>Groups: </strong>
                {selectedRecipient?.groups && selectedRecipient.groups.length > 0
                  ? selectedRecipient.groups.map((group) => group.name).join(', ')
                  : 'Not Added To Any Groups'}
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
    </>
  );
};

export default Recipient;
