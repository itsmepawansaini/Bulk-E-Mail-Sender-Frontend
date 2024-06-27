/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Dropdown, OverlayTrigger, Form, Tooltip, Card, Pagination, Spinner, Modal, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { toast } from 'react-toastify';
import { fetchSenders, deleteSender, updateSender } from '../../slices/senderSlice';
import ConfirmationModal from './DeleteModal';
import EditSenderModal from './EditModal';
import ExportDropdown from './ExportData';

const Sender = () => {
  const title = 'Sender';
  const description = 'Senders List';
  const dispatch = useDispatch();

  const senders = useSelector((state) => state?.senders?.asenders?.senders);
  const totalPagesNo = useSelector((state) => state?.senders?.asenders?.totalPages);
  const status = useSelector((state) => state.senders.status);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSender, setSelectedSender] = useState(null);

  useEffect(() => {
    dispatch(fetchSenders({ search: searchQuery, count: itemsPerPage, page: currentPage }));
  }, [dispatch, searchQuery, currentPage, itemsPerPage]);

  const renderSpinner = () => (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  const renderPaginationItems = () => {
    const totalPages = Math.ceil(senders?.totalPages);
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

  const handleEdit = (sender) => {
    setSelectedSender(sender);
    setShowEditModal(true);
  };
  const updateSenderDetails = ({ id, name, email }) => {
    dispatch(updateSender({ id, name, email }))
      .unwrap()
      .then((response) => {
        console.log(response);
        if (response?.message === 'Sender Updated Successfully') {
          dispatch(fetchSenders({ search: searchQuery, count: itemsPerPage, page: currentPage }));
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
        setSelectedSender(null);
      });
  };

  const handleView = (sender) => {
    setSelectedSender(sender);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDelete = (sender) => {
    setSelectedSender(sender);
    setShowConfirmationModal(true);
  };

  const confirmDelete = () => {
    const id = selectedSender._id;

    dispatch(deleteSender({ id }))
      .unwrap()
      .then((response) => {
        console.log(response);
        if (response?.message === 'Sender Deleted Successfully') {
          dispatch(fetchSenders({ search: searchQuery, count: itemsPerPage, page: currentPage }));
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
    setSelectedSender(null);
  };

  const handleItemClick = (count) => {
    setItemsPerPage(count);
  };

  return (
    <>
      <HtmlHead title={title} description={description} />
      <Col>
        <EditSenderModal show={showEditModal} onHide={() => setShowEditModal(false)} onUpdate={updateSenderDetails} sender={selectedSender} />
        <ConfirmationModal show={showConfirmationModal} onHide={closeModal} onConfirm={confirmDelete} senderName={selectedSender?.name} />

        <div className="page-title-container mb-3">
          <Row>
            <Col className="mb-2">
              <h1 className="mb-2 pb-0 display-4">{title}</h1>
              <div className="text-muted font-heading text-small">Cotton candy gummi bears chocolate candy canes.</div>
            </Col>
            <Col xs="12" sm="auto" className="d-flex align-items-center justify-content-end">
              <NavLink to="/services/sender/add" className="btn btn-outline-primary btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto">
                <CsLineIcons icon="plus" /> <span>Add New</span>
              </NavLink>
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
            <Row className="g-0 h-100 align-content-center d-none d-md-flex ps-5 pe-5 mb-2 custom-sort">
              <Col md="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                <div className="text-muted text-small cursor-pointer sort">S No.</div>
              </Col>
              <Col md="4" className="d-flex flex-column pe-1 justify-content-center">
                <div className="text-muted text-small cursor-pointer sort">NAME</div>
              </Col>
              <Col md="4" className="d-flex flex-column pe-1 justify-content-center">
                <div className="text-muted text-small cursor-pointer sort">EMAIL</div>
              </Col>
              <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
                <div className="text-muted text-small cursor-pointer sort">ACTION</div>
              </Col>
            </Row>

            {senders &&
              senders.map((sender, index) => (
                <Card key={sender.id} className="mb-2">
                  <Card.Body className="pt-0 pb-0 sh-21 sh-md-7">
                    <Row className="g-0 h-100 align-content-center cursor-default">
                      <Col xs="11" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
                        <div className="text-muted text-small d-md-none">S No.</div>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </Col>
                      <Col xs="6" md="4" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
                        <div className="text-muted text-small d-md-none">Name</div>
                        <div className="text-alternate">{sender.name}</div>
                      </Col>
                      <Col xs="6" md="4" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
                        <div className="text-muted text-small d-md-none">Email</div>
                        <div className="text-alternate">{sender.email}</div>
                      </Col>
                      <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-5 w-md-auto">
                        <div className="text-muted text-small d-md-none">Action</div>
                        <div className="flex">
                          <div onClick={() => handleView(sender)} className="btn  btn-outline-success btn-icon btn-icon-action btn-icon-start">
                            <CsLineIcons icon="eye" />
                          </div>
                          <div onClick={() => handleEdit(sender)} className="btn  btn-outline-primary btn-icon btn-icon-action btn-icon-start">
                            <CsLineIcons icon="pen" />
                          </div>
                          <div onClick={() => handleDelete(sender)} className="btn btn-outline-danger btn-icon btn-icon-action btn-icon-start">
                            <CsLineIcons icon="bin" />
                          </div>
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
            {renderPaginationItems()}
            <Pagination.Next className="shadow" onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage === totalPagesNo}>
              <CsLineIcons icon="chevron-right" />
            </Pagination.Next>
          </Pagination>
        </div>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Sender Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedSender && (
              <div>
                <p>
                  <strong>Name:</strong> {selectedSender.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedSender.email}
                </p>
                <p>
                  <strong>Created At:</strong> {selectedSender.createdAt && new Date(selectedSender.createdAt).toLocaleString('en-IN')}
                </p>
                {selectedSender.updatedAt && (
                  <p>
                    <strong>Last Updated:</strong> {new Date(selectedSender.updatedAt).toLocaleString('en-IN')}
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
      </Col>
    </>
  );
};

export default Sender;
