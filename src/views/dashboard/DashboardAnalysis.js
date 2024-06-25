import React, { useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import { useDispatch, useSelector } from 'react-redux';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import 'react-circular-progressbar/dist/styles.css';
import ChartStreamingLine from './components/ChartStreamingLine';
import ChartStreamingBar from './components/ChartStreamingBar';
import { getStats } from '../../slices/dashboardSlice';

const Dashboard = () => {
  const title = 'Dashboard';
  const description = 'Panel Stats';
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStats());
  }, [dispatch]);

  const stats = useSelector((state) => state?.stats?.stats);
  console.log(stats);

  return (
    <>
      <HtmlHead title={title} description={description} />
      <Col>
        <Row className="g-2 mb-5 mt-4">
          <Col lg="6" xxl="3">
            <Card>
              <Card.Body>
                <div className="heading mb-0 d-flex justify-content-between lh-1-25 mb-3">
                  <span>Total Senders</span>
                  <CsLineIcons icon="user" className="text-primary" />
                </div>
                <div className="cta-1 text-primary">{stats?.totalSenders}</div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="6" xxl="3">
            <Card>
              <Card.Body>
                <div className="heading mb-0 d-flex justify-content-between lh-1-25 mb-3">
                  <span>Total Recipients</span>
                  <CsLineIcons icon="user" className="text-primary" />
                </div>
                <div className="cta-1 text-primary">{stats?.totalRecipients}</div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="6" xxl="3">
            <Card>
              <Card.Body>
                <div className="heading mb-0 d-flex justify-content-between lh-1-25 mb-3">
                  <span>Mails Delivered</span>
                  <CsLineIcons icon="email" className="text-primary" />
                </div>
                <div className="cta-1 text-primary">{stats?.totalMails}</div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="6" xxl="3">
            <Card>
              <Card.Body>
                <div className="heading mb-0 d-flex justify-content-between lh-1-25 mb-3">
                  <span>Recipients Groups</span>
                  <CsLineIcons icon="chart-2" className="text-primary" />
                </div>
                <div className="cta-1 text-primary">{stats?.totalRecipientsGroup}</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <br />
        <Row className="g-2 mb-5">
          <Col xxl="6">
            <Card className="mb-5">
              <Card.Body>
                <div className="sh-35">
                  <ChartStreamingLine />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xxl="6">
            <Card className="mb-5">
              <Card.Body>
                <div className="sh-35">
                  <ChartStreamingBar />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Dashboard;
