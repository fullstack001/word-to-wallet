import Image from "next/image";
import { Check } from "lucide-react";

export default function PaymentPreview() {
  return (
    <div className="flex-1 bg-white p-0 rounded-xl shadow-md overflow-hidden">
      {/* Banner */}
      <div className="bg-[#FFE3BB] flex items-center justify-center text-sm  py-2">
        <div className="mr-2 rounded-full bg-red-600 text-white p-1">
          <Check size={12} />
        </div>
        Your document is ready!
      </div>

      <div className="bg-[#DBE1FF] px-24 py-6 relative">
        <div className="absolute top-8 left-8 z-10 bg-red-600 text-white text-lg px-5 py-1 rounded font-bold shadow">
          PDF
        </div>
        <Image
          src="/assets/images/sample-pdf.png"
          alt="Document Preview"
          width={400}
          height={0}
          style={{ height: "auto" }}
          className="mx-auto w-[40%] rounded-lg shadow-sm"
        />
      </div>
    </div>
  );
}