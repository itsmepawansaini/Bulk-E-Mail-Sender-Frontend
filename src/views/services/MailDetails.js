/* eslint-disable no-else-return */
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMailById } from '../../slices/mailSlice';

const MailDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    dispatch(fetchMailById({ id }))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [dispatch, id]);

  const mailDetails = useSelector((state) => state?.mail?.mailDetails);

  useEffect(() => {
    if (mailDetails && mailDetails.attachments) {
      setAttachments(mailDetails.attachments);
    }
  }, [mailDetails]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!mailDetails) {
    return <div className="text-center mt-5">Error: Mail details not found</div>;
  }

  const sentAt = new Date(mailDetails.sentAt);
  const formattedDate = sentAt.toLocaleDateString('en-GB');
  const formattedTime = sentAt.toLocaleTimeString('en-US', { hour12: false });

  return (
    <Col>
      <div className="page-title-container mb-3">
        <Row>
          <Col xxl="12" className="mb-5 mb-xxl-0">
            <Card className="mb-2">
              <Card.Body>
                <div className="mb-4">
                  <Row className="g-0 sh-sm-5 h-auto">
                    <Col xs="auto">
                      <img src="/img/profile/profile-5.webp" className="card-img rounded-xl sh-5 sw-5" alt="thumb" />
                    </Col>
                    <Col className="ps-3">
                      <Row className="h-100 g-2">
                        <Col className="h-sm-100 d-flex flex-column justify-content-sm-center mb-1 mb-sm-0">
                          <div>{mailDetails.fromName}</div>
                          <div className="text-small text-muted">{mailDetails.fromId}</div>
                        </Col>
                        <Col
                          xs="12"
                          className="order-3 order-0 col-auto sw-sm-12 lh-1-5 text-small text-muted text-sm-end d-flex flex-column justify-content-center"
                        >
                          <div>{formattedDate}</div>
                          <div>{formattedTime}</div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <div>
                    <div className="mt-4">
                      <p>{mailDetails.subject}</p>
                      <div dangerouslySetInnerHTML={{ __html: mailDetails.body }} />
                      <hr />
                      <p className="mb-0">
                        Recipients:{' '}
                        {mailDetails.to && (
                          <p className="mb-0">
                            {mailDetails.to.map((recipient, index) => (
                              <span key={index}>
                                {recipient}
                                {index !== mailDetails.to.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </p>
                        )}
                      </p>
                      {attachments.length > 0 && (
                        <div className="mt-3">
                          <strong>Attachments:</strong>
                          <ul>
                            {attachments.map((attachment, index) => {
                              const isImage = attachment.contentType.startsWith('image/');
                              if (isImage) {
                                return (
                                  <li key={index}>
                                    <img
                                      src={`data:${attachment.contentType};base64,${attachment.content}`}
                                      alt={attachment.filename}
                                      style={{ maxWidth: '100%', height: 'auto' }}
                                    />
                                  </li>
                                );
                              } else {
                                return (
                                  <li key={index}>
                                    <a href={`data:${attachment.contentType};base64,${attachment.content}`} target="_blank" rel="noopener noreferrer">
                                      {attachment.filename}
                                    </a>
                                  </li>
                                );
                              }
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default MailDetails;
