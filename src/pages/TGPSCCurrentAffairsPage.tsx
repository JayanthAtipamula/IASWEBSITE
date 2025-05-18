import React from 'react';
import CurrentAffairsDates from '../components/CurrentAffairsDates';

const TGPSCCurrentAffairsPage: React.FC = () => {
  return (
    <CurrentAffairsDates 
      examType="tgpsc" 
      title="TGPSC Current Affairs" 
      color="green" 
    />
  );
};

export default TGPSCCurrentAffairsPage;
