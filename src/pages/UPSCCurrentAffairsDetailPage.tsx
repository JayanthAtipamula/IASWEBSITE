import React from 'react';
import CurrentAffairsDetail from '../components/CurrentAffairsDetail';

const UPSCCurrentAffairsDetailPage: React.FC = () => {
  return (
    <CurrentAffairsDetail 
      examType="upsc" 
      title="UPSC Current Affairs" 
      color="blue" 
    />
  );
};

export default UPSCCurrentAffairsDetailPage;
