export const handlePermohonanBaruBack = (setCurrentPage: (page: string) => void) => {
  const isFromInternal = sessionStorage.getItem('referrer') === 'internal';
  if (isFromInternal) {
    sessionStorage.removeItem('referrer');
    setCurrentPage('internal');
  } else {
    setCurrentPage('guest');
  }
};

export const handlePermohonanBaruSubmit = async (
  data: any,
  addSubmission: (data: any) => Promise<boolean>,
  setCurrentPage: (page: string) => void
) => {
  console.log('🔄 Navigation: Starting submission...');
  
  const success = await addSubmission(data);
  
  console.log('📊 Navigation: Submission result:', { success });
  
  if (success) {
    console.log('✅ Navigation: Submission successful, navigating back');
    const isFromInternal = sessionStorage.getItem('referrer') === 'internal';
    if (isFromInternal) {
      sessionStorage.removeItem('referrer');
      setCurrentPage('internal');
    } else {
      setCurrentPage('guest');
    }
  } else {
    console.log('❌ Navigation: Submission failed, staying on form');
    // Don't navigate away if submission failed - let user fix issues
  }
};