import React from 'react';
import CurrentAffairsDates from '../components/CurrentAffairsDates';

interface TGPSCCurrentAffairsPageProps {
  initialData?: any;
}

const TGPSCCurrentAffairsPage: React.FC<TGPSCCurrentAffairsPageProps> = ({ initialData }) => {
  return (
    <CurrentAffairsDates 
      examType="tgpsc" 
      title="TGPSC Current Affairs" 
      color="green"
      initialData={initialData}
    />
  );
};

export default TGPSCCurrentAffairsPage;
