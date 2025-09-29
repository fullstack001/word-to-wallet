"use client";

import React from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuctionView from "@/components/auction/AuctionView";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useLocalizedNavigation } from "@/utils/navigation";

interface AuctionPageProps {
  params: Promise<{
    id: string;
  }>;
}

const AuctionPage: React.FC<AuctionPageProps> = ({ params }) => {
  const { navigate } = useLocalizedNavigation();
  const [auctionId, setAuctionId] = React.useState<string>("");

  React.useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setAuctionId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  const handleGoBack = () => {
    navigate("/auctions");
  };

  if (!auctionId) {
    return <div>Loading...</div>;
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8  pt-36">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={handleGoBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Auctions
            </button>
          </div>

          <AuctionView auctionId={auctionId} />
        </div>

        <Footer />
      </div>
    </AuthGuard>
  );
};

export default AuctionPage;
