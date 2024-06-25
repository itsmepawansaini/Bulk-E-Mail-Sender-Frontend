import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'layout/Layout';
import RouteIdentifier from 'routing/components/RouteIdentifier';
import { getRoutes } from 'routing/helper';
import routesAndMenuItems from 'routes.js';
import Loading from 'components/loading/Loading';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';

const App = () => {
  const history = useHistory();
  const { currentUser, isLogin } = useSelector((state) => state.auth);

  const routes = useMemo(() => getRoutes({ data: routesAndMenuItems, isLogin, userRole: 'admin' }), [isLogin, currentUser]);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      history.push('/login');
    }
  }, [history]);

  if (localStorage.getItem('token') && routes) {
    return (
      <Layout>
        <RouteIdentifier routes={routes} fallback={<Loading />} />
        <ToastContainer />
      </Layout>
    );
  }
  return null;
};

export default App;
