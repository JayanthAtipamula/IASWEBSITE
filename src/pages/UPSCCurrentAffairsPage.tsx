import React from 'react';
import CurrentAffairsDates from '../components/CurrentAffairsDates';

const UPSCCurrentAffairsPage: React.FC = () => {
  return (
    <CurrentAffairsDates 
      examType="upsc" 
      title="UPSC Current Affairs" 
      color="blue" 
    />
  );
};

export default UPSCCurrentAffairsPage;
