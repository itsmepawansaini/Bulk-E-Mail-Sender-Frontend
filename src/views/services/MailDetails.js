/* eslint-disable no-else-return */
import React, { useEffect, useState } from 'react';
import { Col, Card, Spinner } from 'react-bootstrap';
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
        <Card className="mb-2">
          <Card.Body>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <img src="/img/profile/profile-5.webp" className="card-img rounded-xl sh-5 sw-5" alt="thumb" />
                <div className="ms-3">
                  <div>{mailDetails.fromName}</div>
                  <div className="text-small text-muted">{mailDetails.fromId}</div>
                </div>
                <div className="ms-auto text-end text-muted">
                  <div>{formattedDate}</div>
                  <div>{formattedTime}</div>
                </div>
              </div>
              <div className="mt-4">
                <p>{mailDetails.subject}</p>
                <div dangerouslySetInnerHTML={{ __html: mailDetails.body }} />
                <hr />
                <p className="mb-0">
                  Recipients:{' '}
                  {mailDetails.to && (
                    <span>
                      {mailDetails.to.map((recipient, index) => (
                        <span key={index}>
                          {recipient}
                          {index !== mailDetails.to.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </span>
                  )}
                </p>
                {attachments.length > 0 && (
                  <div className="mt-3">
                    <strong>Attachments:</strong>
                    <ul className="list-unstyled">
                      {attachments.map((attachment, index) => {
                        const isImage = attachment.contentType && attachment.contentType.startsWith('image/');
                        if (isImage) {
                          return (
                            <li key={index}>
                              <img width={200} src={attachment.url} alt={attachment.filename} style={{ maxWidth: '100%', height: 'auto' }} />
                            </li>
                          );
                        } else {
                          return (
                            <li key={index}>
                              <a href={attachment.url} target="_blank" rel="noopener noreferrer">
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
          </Card.Body>
        </Card>
      </div>
    </Col>
  );
};

export default MailDetails;
