import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { addSender } from '../../slices/senderSlice';

const AddSender = () => {
  const title = 'Add Sender';
  const description = 'Add New Sender';
  const dispatch = useDispatch();
  const history = useHistory();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(addSender({ name, email }))
      .unwrap()
      .then((response) => {
        if (response === 'Sender Added') {
          setLoading(false);
          toast.success('Added Successfully!');
          history.push('/services/sender/');
        } else {
          setLoading(false);
          toast.error('Failed To Add Sender. Please Try Again.');
        }
        setName('');
        setEmail('');
      })
      .catch((error) => {
        setLoading(false);
        toast.error('Failed To Add Sender. Please Try Again.');
      });
  };

  return (
    <>
      <HtmlHead title={title} description={description} />
      <Col>
        <div className="page-title-container mb-3">
          <Row>
            <Col className="mb-2">
              <h1 className="mb-2 pb-0 display-4">{title}</h1>
              <div className="text-muted font-heading text-small">Macaroon dessert tootsie roll powder jelly-o dragée candy canes gummi bears.</div>
            </Col>
          </Row>
        </div>

        <Card className="mb-5">
          <Card.Body>
            <Form className="mb-n3" onSubmit={handleSubmit}>
              <div className="mb-3 filled">
                <CsLineIcons icon="tag" />
                <Form.Control type="text" placeholder="Sender Name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="mb-3 filled">
                <CsLineIcons icon="user" />
                <Form.Control type="email" placeholder="Sender Email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
      </Col>
    </>
  );
};

export default AddSender;
