import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAction, setFileName } from "../store/slices/flowSlice";
import { RootState } from "../store/store";
import { downloadFile, compressPdf } from "./apiUtils";
import { CompressionLevel } from "@/components/common/CompressionLevelModal";
import { useLocalizedNavigation } from "./navigation";

export const useCompressPdf = () => {
  const dispatch = useDispatch();
  const { navigate } = useLocalizedNavigation();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string[]>([]);
  const [isEmailModalVisible, setEmailModalVisible] = useState(false);
  const [isCompressionModalVisible, setIsCompressionModalVisible] =
    useState(false);
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const subscription = useSelector(
    (state: RootState) => state.user.subscription
  );
  const auth = useSelector((state: RootState) => state.auth.isLoggedIn);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the file and show compression modal instead of uploading immediately
    setSelectedFile(file);
    setIsCompressionModalVisible(true);
  };

  const handleCompress = async (compressionLevel: CompressionLevel) => {
    if (!selectedFile) return;

    setIsCompressionModalVisible(false);
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
          setStatus(["Uploading file...", "Compressing the document..."]);
        } else if (loaded >= 40) {
          setStatus([
            "Uploading file...",
            "Compressing the document...",
            "Securing the document...",
          ]);
        } else if (loaded >= 70) {
          clearInterval(interval);
        }
      }, 300);
      fileName = await compressPdf(selectedFile, compressionLevel);
      dispatch(setFileName(fileName));
      dispatch(setAction("compress_pdf"));
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
            navigate(`/files`);
            await downloadFile(fileName, "compress_pdf", token);
          } catch (err) {
            console.error("Error downloading file:", err);
            window.alert("Failed to download file.");
          }
        } else {
          navigate(`/plan`);
        }
      }
    } catch (error) {
      console.error("Error during file compression:", error);
      setUploading(false);
      alert("File compression failed. Please try again.");
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return {
    uploading,
    progress,
    status,
    isEmailModalVisible,
    isCompressionModalVisible,
    email,
    setEmail,
    setEmailModalVisible,
    setIsCompressionModalVisible,
    handleFileChange,
    handleCompress,
    selectedFile,
    formatFileSize,
  };
};
