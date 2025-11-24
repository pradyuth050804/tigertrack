import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  fallbackPath?: string; // Default path if history is empty
}

const BackButton: React.FC<BackButtonProps> = ({ fallbackPath = '/dashboard' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Try to go back in history; if no history, navigate to fallback
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className="flex items-center gap-2 mb-4"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
};

export default BackButton;
