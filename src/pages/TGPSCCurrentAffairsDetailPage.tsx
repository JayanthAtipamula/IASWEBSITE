import React from 'react';
import CurrentAffairsDetail from '../components/CurrentAffairsDetail';

interface TGPSCCurrentAffairsDetailPageProps {
  initialData?: any;
}

const TGPSCCurrentAffairsDetailPage: React.FC<TGPSCCurrentAffairsDetailPageProps> = ({ initialData }) => {
  return (
    <CurrentAffairsDetail 
      examType="tgpsc" 
      title="TGPSC Current Affairs" 
      color="green"
      initialData={initialData}
    />
  );
};

export default TGPSCCurrentAffairsDetailPage;
