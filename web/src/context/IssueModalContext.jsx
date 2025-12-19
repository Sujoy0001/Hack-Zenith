import { createContext, useContext, useState } from "react";
import IssueUploadModal from "../components/IssueUpload";

const IssueModalContext = createContext();

export function IssueModalProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openIssueModal = () => setOpen(true);
  const closeIssueModal = () => setOpen(false);

  const handleSubmit = (data) => {
    console.log("Issue Submitted:", data);
    // API call here (FastAPI / Django)
  };

  return (
    <IssueModalContext.Provider value={{ openIssueModal }}>
      {children}

      <IssueUploadModal
        isOpen={open}
        onClose={closeIssueModal}
        onSubmit={handleSubmit}
      />
    </IssueModalContext.Provider>
  );
}

export const useIssueModal = () => useContext(IssueModalContext);
