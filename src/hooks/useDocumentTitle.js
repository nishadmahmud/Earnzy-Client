import { useEffect } from 'react';

const useDocumentTitle = (title, dependencies = []) => {
  useEffect(() => {
    // Set the new title
    document.title = title ? `${title} | Earnzy` : 'Earnzy - Micro Task Platform';
  }, [title, ...dependencies]);
};

export default useDocumentTitle; 