import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import ConsumerProfile from './profiles/ConsumerProfile';
import SellerProfile from './profiles/SellerProfile';

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return user?.profileType === 'seller' ? <SellerProfile /> : <ConsumerProfile />;
};

export default Profile; 