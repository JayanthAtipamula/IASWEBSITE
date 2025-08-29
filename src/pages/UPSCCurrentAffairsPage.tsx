import React from 'react';
import CurrentAffairsDates from '../components/CurrentAffairsDates';

interface UPSCCurrentAffairsPageProps {
  initialData?: any;
}

const UPSCCurrentAffairsPage: React.FC<UPSCCurrentAffairsPageProps> = ({ initialData }) => {
  return (
    <CurrentAffairsDates 
      examType="upsc" 
      title="UPSC Current Affairs" 
      color="blue"
      initialData={initialData}
    />
  );
};

export default UPSCCurrentAffairsPage;
