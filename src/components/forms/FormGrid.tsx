import Image from 'next/image';
import { Eye } from "lucide-react";

const forms = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: 'Fill out Form VA 10-2850C Online in 2024',
  thumbnail: '/assets/images/form_image.png',
}));

export default function FormGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {forms.map((form) => (
        <div
          key={form.id}
          className="bg-white rounded-lg shadow-md p-4 text-sm text-center"
        >
          <Image
            src={form.thumbnail}
            alt={form.title}
            width={200}
            height={0}
            style={{ height: "auto" }}
            className="mx-auto rounded"
          />
          <p className="mt-2 mb-4 text-xs">{form.title}</p>
          <button className="bg-[#4B68FF] text-white w-full py-1.5 rounded-md text-sm  flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
            <Eye size={16} />
            View Form
          </button>
        </div>
      ))}
    </div>
  );
}
