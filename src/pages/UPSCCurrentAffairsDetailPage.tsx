import React from 'react';
import CurrentAffairsDetail from '../components/CurrentAffairsDetail';

interface UPSCCurrentAffairsDetailPageProps {
  initialData?: any;
}

const UPSCCurrentAffairsDetailPage: React.FC<UPSCCurrentAffairsDetailPageProps> = ({ initialData }) => {
  return (
    <CurrentAffairsDetail 
      examType="upsc" 
      title="UPSC Current Affairs" 
      color="blue"
      initialData={initialData}
    />
  );
};

export default UPSCCurrentAffairsDetailPage;
