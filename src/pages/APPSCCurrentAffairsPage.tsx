import React from 'react';
import CurrentAffairsDates from '../components/CurrentAffairsDates';

const APPSCCurrentAffairsPage: React.FC = () => {
  return (
    <CurrentAffairsDates 
      examType="appsc" 
      title="APPSC Current Affairs" 
      color="purple" 
    />
  );
};

export default APPSCCurrentAffairsPage;
