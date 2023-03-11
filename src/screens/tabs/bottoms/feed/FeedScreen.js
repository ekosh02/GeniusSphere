import React from 'react';
import Viewer from '../../../../components/views/Viewer';
import Header from '../.././../../components/bars/Header'

const FeedScreen = () => {
  return (
    <Viewer>
      <Header />
      <Viewer></Viewer>
    </Viewer>
  );
};

export default FeedScreen;
