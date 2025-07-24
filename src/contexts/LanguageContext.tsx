import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // ConsentForm
    welcomeTitle: 'Welcome to the dementia detection app',
    continueButton: 'Continue',
    confirmationTitle: 'Confirmation',
    confirmationMessage: 'Do you agree to be contacted later?',
    proceedMessage: 'Please proceed by hitting continue.',
    
    // LandingPage
    mainTitle: "Alzheimer's Disease Detection From Voice",
    startButton: 'Start',
    devMode: 'Dev Mode',
    selectMode: 'Select Mode',
    
    // ContactForm
    namePlaceholder: 'Name/Alias',
    emailPlaceholder: 'Email Address',
    invalidEmail: 'Please enter a valid email address.',
    invalidEmailTitle: 'Invalid Email',
    nextButton: 'Next',
    
    // InstructionPage
    instructionsTitle: 'Instructions',
    instruction1: '1. Click to next.',
    instruction2: '2. Hit the record button and verbally describe the image.',
    instruction3: '3. Hit the stop button when you are done.',
    
    // RecordPage
    recordInstruction1: '1. Hit the record button and verbally describe the image.',
    recordInstruction2: '2. Hit the same button when you are done with describing.',
    processing: 'Processing...',
    timer: 'Timer',
    micPermissionRequired: 'Permission to access microphone is required!',
    
    // ReportPage
    restartButton: 'Restart',
    displayReportButton: 'Display Report',
    noAbnormality: 'No abnormality detected by our system',
    consultDoctor: 'Please consult with your doctor',
    
    // Common
    yes: 'Yes',
    no: 'No',
    cancel: 'Cancel',
    error: 'Error',
    serverTimeout: 'Server response timed out. Please try again.',
  },
  zh: {
    // ConsentForm
    welcomeTitle: '歡迎試用認知評估小程式',
    continueButton: '繼續',
    confirmationTitle: '確認',
    confirmationMessage: '你同意與我們保持聯絡嗎?',
    proceedMessage: '點擊.',
    
    // LandingPage
    mainTitle: '以語音模式作認知障礙初步評估',
    startButton: '開始',
    devMode: '開發模式',
    selectMode: '選擇模式',
    
    // ContactForm
    namePlaceholder: '姓名/別名',
    emailPlaceholder: '電子郵件地址',
    invalidEmail: '請輸入有效的電子郵件地址。',
    invalidEmailTitle: '無效電子郵件',
    nextButton: '下一步',
    
    // InstructionPage
    instructionsTitle: '操作說明',
    instruction1: '1. 按掣繼續.',
    instruction2: '2. 點擊開始, 簡單描述圖中影像.',
    instruction3: '3. 重新點擊結束錄音.',
    
    // RecordPage
    recordInstruction1: '1. 點擊開始, 簡單描述圖中影像.',
    recordInstruction2: '2. 重新點擊結束錄音.',
    processing: '處理中...',
    timer: '計時器',
    micPermissionRequired: '需要麥克風權限！',
    
    // ReportPage
    restartButton: '重新開始',
    displayReportButton: '展示報告',
    noAbnormality: '檢測沒有異常',
    consultDoctor: '請諮詢醫療人員瞭解更多',
    
    // Common
    yes: '是',
    no: '否',
    cancel: '取消',
    error: '錯誤',
    serverTimeout: '服務器響應超時。請重試。',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
