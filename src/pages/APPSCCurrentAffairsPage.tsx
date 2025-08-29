import React from 'react';
import CurrentAffairsDates from '../components/CurrentAffairsDates';

interface APPSCCurrentAffairsPageProps {
  initialData?: any;
}

const APPSCCurrentAffairsPage: React.FC<APPSCCurrentAffairsPageProps> = ({ initialData }) => {
  return (
    <CurrentAffairsDates 
      examType="appsc" 
      title="APPSC Current Affairs" 
      color="purple"
      initialData={initialData}
    />
  );
};

export default APPSCCurrentAffairsPage;
