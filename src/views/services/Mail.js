/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Dropdown, OverlayTrigger, Form, Tooltip, Card, Pagination, Spinner } from 'react-bootstrap';
import { NavLink, useHistory, Link } from 'react-router-dom';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { fetchMails } from '../../slices/mailSlice';

const Mail = () => {
  const title = 'Mail';
  const description = 'Mail List';
  const dispatch = useDispatch();
  const history = useHistory();

  const mails = useSelector((state) => state?.mail?.mail?.emails);
  const totalPagesNo = useSelector((state) => state?.mail?.mail?.totalPages);
  const status = useSelector((state) => state.mail.status);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchMails({ search: searchQuery, count: itemsPerPage, page: currentPage }));
  }, [dispatch, searchQuery, currentPage, itemsPerPage]);

  const renderSpinner = () => (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  const renderPaginationItems = () => {
    const totalPages = Math.ceil(mails?.totalPages);
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

  const handleViewMail = (mail) => {
    history.push(`/services/mailDetails/${mail.id}`);
  };

  const handleViewRecipients = (mail) => {
    history.push(`/mail/recipients/${mail.id}`);
  };

  return (
    <>
      <HtmlHead title={title} description={description} />
      <Col>
        <div className="page-title-container mb-3">
          <Row>
            <Col className="mb-2">
              <h1 className="mb-2 pb-0 display-4">{title}</h1>
              <div className="text-muted font-heading text-small">Cotton candy gummi bears chocolate candy canes.</div>
            </Col>
            <Col xs="12" sm="auto" className="d-flex align-items-center justify-content-end">
              <NavLink to="/services/sendMail" className="btn btn-outline-primary btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto">
                <CsLineIcons icon="plus" /> <span>Compose Mail</span>
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

            <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1">
              <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Item Count</Tooltip>}>
                <Dropdown.Toggle variant="foreground-alternate" className="shadow sw-13">
                  10 Items
                </Dropdown.Toggle>
              </OverlayTrigger>
              <Dropdown.Menu className="shadow dropdown-menu-end">
                <Dropdown.Item href="#">5 Items</Dropdown.Item>
                <Dropdown.Item href="#">10 Items</Dropdown.Item>
                <Dropdown.Item href="#">20 Items</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        {status === 'loading' ? (
          renderSpinner()
        ) : (
          <div className="mb-5">
            <Row className="g-0 h-100 align-content-center d-none d-md-flex ps-5 pe-5 mb-2 custom-sort">
              <Col md="1" className="d-flex flex-column pe-1 d-flex">
                <div className="text-muted text-small cursor-pointer sort">S No.</div>
              </Col>
              <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
                <div className="text-muted text-small cursor-pointer sort">SENDER</div>
              </Col>
              <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
                <div className="text-muted text-small cursor-pointer sort">DATE</div>
              </Col>
              <Col md="4" className="d-flex flex-column pe-1 justify-content-center">
                <div className="text-muted text-small cursor-pointer sort">SUBJECT</div>
              </Col>
              <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
                <div className="text-muted text-small cursor-pointer sort">ACTION</div>
              </Col>
            </Row>

            {mails &&
              mails.map((mail, index) => (
                // eslint-disable-next-line no-underscore-dangle
                <Card key={mail._id} className="mb-2">
                  <Card.Body className="pt-0 pb-0 sh-21 sh-md-7">
                    <Row className="g-0 h-100 align-content-center cursor-default">
                      <Col xs="3" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
                        <div className="text-muted text-small d-md-none">S No.</div>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </Col>
                      <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-2 order-md-2">
                        <div className="text-muted text-small d-md-none">Sender</div>
                        <div className="text-alternate">{mail.fromId}</div>
                      </Col>
                      <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-3">
                        <div className="text-muted text-small d-md-none">Date</div>
                        <div className="text-alternate">{new Date(mail.sentAt).toLocaleDateString('en-GB')}</div>
                      </Col>
                      <Col xs="6" md="4" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-4">
                        <div className="text-muted text-small d-md-none">Subject</div>
                        <div>{mail.subject}</div>
                      </Col>
                      <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-5">
                        <div className="text-muted text-small d-md-none">Action</div>
                        <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">View Details</Tooltip>}>
                          <Link to={`/services/mailDetails/${mail._id}`}>
                            <div className="btn  btn-outline-success btn-icon btn-icon-action btn-icon-start">
                              <CsLineIcons icon="eye" />
                            </div>
                          </Link>
                        </OverlayTrigger>
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
      </Col>
    </>
  );
};

export default Mail;
