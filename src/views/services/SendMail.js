/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import HtmlHead from 'components/html-head/HtmlHead';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { fetchSenders } from '../../slices/senderSlice';
import { fetchRecipient, fetchRecipientGroup, fetchRecipientByGroup } from '../../slices/recipientSlice';
import { sendEmail } from '../../slices/mailSlice';

const SendMail = () => {
  const title = 'Mail';
  const description = 'Send Mail';

  const dispatch = useDispatch();
  const history = useHistory();

  const [senderEmail, setSenderEmail] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [recipientGroups, setRecipientGroups] = useState([]);
  const [emailContent, setEmailContent] = useState('');
  const [mailAttachment, setMailAttachment] = useState(null);
  const [mailSubject, setMailSubject] = useState('');

  const senders = useSelector((state) => state?.senders?.asenders?.senders);
  const recipientsGroup = useSelector((state) => state?.recipient?.arecipientsgroup);
  const recipientsByGroupId = useSelector((state) => state?.recipient?.arecipientsgroupbyid);
  const emailStatus = useSelector((state) => state.mail.status);

  useEffect(() => {
    dispatch(fetchSenders({ search: '', count: 100, page: 1 }));
    dispatch(fetchRecipient({ search: '', count: 100, page: 1 }));
    dispatch(fetchRecipientGroup());
  }, [dispatch]);

  useEffect(() => {
    if (recipientGroups.length > 0) {
      const id = recipientGroups[recipientGroups.length - 1]?.value;
      dispatch(fetchRecipientByGroup({ id }));
    }
  }, [dispatch, recipientGroups]);

  useEffect(() => {
    if (recipientsByGroupId) {
      setRecipients((prevRecipients) => {
        const newRecipients = recipientsByGroupId.filter((recipient) => !prevRecipients.some((r) => r.value === recipient.email));
        return [...prevRecipients, ...newRecipients.map((recipient) => ({ value: recipient.email, label: recipient.name }))];
      });
    }
  }, [recipientsByGroupId]);

  const handleAttachmentChange = (e) => {
    setMailAttachment(e.target.files[0]);
  };

  const handleSendMail = () => {
    const formData = new FormData();
    formData.append('fromName', senderEmail.data);
    formData.append('fromId', senderEmail.value);
    formData.append('replyto', senderEmail.value);
    formData.append('to', recipients.map((recipient) => recipient.value).join(','));
    formData.append('subject', mailSubject);
    formData.append('body', emailContent);
    if (mailAttachment) {
      formData.append('attachment', mailAttachment);
    }

    dispatch(sendEmail(formData))
      .then((response) => {
        toast.success('Mail Sent');
        history.push('/services/mail/');
      })
      .catch((error) => {
        toast.error('Failed To Send Mail. Please Try Again.');
      });
  };

  const handleSenderChange = (selectedOption) => {
    setSenderEmail(selectedOption);
  };

  const handleGroupChange = (selectedGroups) => {
    setRecipientGroups(selectedGroups);
  };

  const senderOptions = senders && senders.map((sender) => ({ value: sender.email, label: sender.email, data: sender.name }));
  const recipientGroupsFormatted = recipientsGroup && recipientsGroup.map((group) => ({ value: group._id, label: group.name }));
  const uniqueRecipients = Array.from(new Set(recipients.map((recipient) => recipient.value))).map((email) =>
    recipients.find((recipient) => recipient.value === email)
  );

  return (
    <>
      <HtmlHead title={title} description={description} />
      <Col>
        <div className="page-title-container mb-3">
          <Row>
            <Col className="mb-2">
              <h1 className="mb-2 pb-0 display-4">{title}</h1>
              <div className="text-muted font-heading text-small">Dragée pudding caramels oat cake icing muffin pudding.</div>
            </Col>
          </Row>
        </div>

        <Card className="mb-5">
          <Card.Body>
            <Form>
              <Row className="mb-3">
                <Col md="4">
                  <Form.Group>
                    <Form.Label>Sender Email</Form.Label>
                    <Select options={senderOptions} value={senderEmail} onChange={handleSenderChange} placeholder="Select Sender Email" />
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group>
                    <Form.Label>Recipient Groups</Form.Label>
                    <Select
                      options={recipientGroupsFormatted}
                      value={recipientGroups}
                      onChange={handleGroupChange}
                      isMulti
                      placeholder="Select Recipient Groups"
                    />
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group>
                    <Form.Label>Recipients</Form.Label>
                    <Select options={uniqueRecipients} value={recipients} onChange={setRecipients} isMulti placeholder="Select Recipients" />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control type="text" value={mailSubject} onChange={(e) => setMailSubject(e.target.value)} placeholder="Enter Subject" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email Content</Form.Label>
                <ReactQuill value={emailContent} onChange={setEmailContent} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Attachment</Form.Label>
                <Form.Control type="file" onChange={handleAttachmentChange} />
              </Form.Group>

              <Button variant="primary" onClick={handleSendMail}>
                Send Mail
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default SendMail;
