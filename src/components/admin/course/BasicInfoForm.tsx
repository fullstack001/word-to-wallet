"use client";

interface BasicInfoFormProps {
  formData: {
    title: string;
    description?: string;
    subject: string;
    isActive: boolean;
    isPublished: boolean;
    googleDocLink: string;
    googleClassroomLink: string;
  };
  errors: { [key: string]: string };
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

export default function BasicInfoForm({
  formData,
  errors,
  onChange,
}: BasicInfoFormProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900 border-b pb-2">
        Basic Information
      </h4>

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Course Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={onChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.title ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter course title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={onChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.description ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter course description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="googleDocLink"
          className="block text-sm font-medium text-gray-700"
        >
          Google Doc Link
        </label>
        <input
          type="url"
          id="googleDocLink"
          name="googleDocLink"
          value={formData.googleDocLink}
          onChange={onChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.googleDocLink ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="https://docs.google.com/document/d/..."
        />
        {errors.googleDocLink && (
          <p className="mt-1 text-sm text-red-600">{errors.googleDocLink}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="googleClassroomLink"
          className="block text-sm font-medium text-gray-700"
        >
          Google Classroom Link
        </label>
        <input
          type="url"
          id="googleClassroomLink"
          name="googleClassroomLink"
          value={formData.googleClassroomLink}
          onChange={onChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.googleClassroomLink ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="https://classroom.google.com/c/..."
        />
        {errors.googleClassroomLink && (
          <p className="mt-1 text-sm text-red-600">
            {errors.googleClassroomLink}
          </p>
        )}
      </div>

      {/* Status Checkboxes */}
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isActive"
            className="ml-2 block text-sm text-gray-900"
          >
            Active
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="isPublished"
            name="isPublished"
            type="checkbox"
            checked={formData.isPublished}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isPublished"
            className="ml-2 block text-sm text-gray-900"
          >
            Published
          </label>
        </div>
      </div>
    </div>
  );
}
