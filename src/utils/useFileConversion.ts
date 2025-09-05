import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAction, setFileName } from "../store/slices/flowSlice";
import { RootState } from "../store/store";
import { downloadFile } from "./apiUtils";
import { useLocalizedNavigation } from "./navigation";

interface ConversionConfig {
  convertFunction: (file: File) => Promise<string>;
  action: string;
  acceptType?: string;
}

export const useFileConversion = (config: ConversionConfig) => {
  const dispatch = useDispatch();
  const { navigate } = useLocalizedNavigation();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string[]>([]);
  const [isEmailModalVisible, setEmailModalVisible] = useState(false);
  const [email, setEmail] = useState("");

  const subscription = useSelector(
    (state: RootState) => state.user.subscription
  );
  const auth = useSelector((state: RootState) => state.auth.isLoggedIn);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus(["Uploading file..."]);

    try {
      let fileName = "";
      // Simulate step-by-step progress updates
      let loaded = progress;
      const interval = setInterval(() => {
        loaded += 10;
        setProgress(Math.min(loaded, 90));
        if (loaded === 20) {
          setStatus(["Uploading file...", "Converting the document..."]);
        } else if (loaded >= 40) {
          setStatus([
            "Uploading file...",
            "Converting the document...",
            "Securing the document...",
          ]);
        } else if (loaded >= 70) {
          clearInterval(interval);
        }
      }, 300);

      fileName = await config.convertFunction(file);
      dispatch(setFileName(fileName));
      dispatch(setAction(config.action));
      setUploading(false);

      if (!auth) {
        setEmailModalVisible(true);
      } else {
        const token = localStorage.getItem("authToken");

        if (
          subscription &&
          new Date(subscription.expiryDate) > new Date() &&
          token
        ) {
          try {
            await downloadFile(fileName, config.action, token);
            navigate("/files");
          } catch (err) {
            console.error("Error downloading file:", err);
            window.alert("Failed to download file.");
          }
        } else {
          navigate(`/plan`);
        }
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      setUploading(false);
      alert("File upload failed. Please try again.");
    }
  };

  return {
    uploading,
    progress,
    status,
    isEmailModalVisible,
    email,
    setEmail,
    setEmailModalVisible,
    handleFileChange,
    acceptType: config.acceptType,
  };
};
