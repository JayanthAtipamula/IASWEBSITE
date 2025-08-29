import React from 'react';
import CurrentAffairsDetail from '../components/CurrentAffairsDetail';

interface APPSCCurrentAffairsDetailPageProps {
  initialData?: any;
}

const APPSCCurrentAffairsDetailPage: React.FC<APPSCCurrentAffairsDetailPageProps> = ({ initialData }) => {
  return (
    <CurrentAffairsDetail 
      examType="appsc" 
      title="APPSC Current Affairs" 
      color="purple"
      initialData={initialData}
    />
  );
};

export default APPSCCurrentAffairsDetailPage;
