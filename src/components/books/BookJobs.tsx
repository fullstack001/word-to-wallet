"use client";

import { useTranslations } from "next-intl";
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface Job {
  _id: string;
  type: string;
  status: string;
  progress: number;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  completedAt?: string;
  error?: any;
}

interface BookJobsProps {
  jobs: Job[];
}

export function BookJobs({ jobs }: BookJobsProps) {
  const t = useTranslations("books");

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case "epub_validation":
        return t("jobEpubValidation");
      case "epub_packaging":
        return t("jobEpubPackaging");
      case "bookfunnel_upload":
        return t("jobBookFunnelUpload");
      case "arc_campaign_create":
        return t("jobArcCampaignCreate");
      case "arc_codes_generate":
        return t("jobArcCodesGenerate");
      case "bookfunnel_sync":
        return t("jobBookFunnelSync");
      default:
        return type;
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircleIcon,
          color: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "processing":
        return {
          icon: ArrowPathIcon,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "failed":
        return {
          icon: ExclamationTriangleIcon,
          color: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case "retrying":
        return {
          icon: ArrowPathIcon,
          color: "text-yellow-500",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      case "cancelled":
        return {
          icon: XCircleIcon,
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
      default:
        return {
          icon: ClockIcon,
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return t("statusPending");
      case "processing":
        return t("statusProcessing");
      case "completed":
        return t("statusCompleted");
      case "failed":
        return t("statusFailed");
      case "retrying":
        return t("statusRetrying");
      case "cancelled":
        return t("statusCancelled");
      default:
        return status;
    }
  };

  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <ClockIcon className="h-5 w-5 mr-2" />
          {t("processingJobs")}
        </h3>

        <div className="space-y-4">
          {jobs.map((job) => {
            const statusConfig = getStatusConfig(job.status);
            const Icon = statusConfig.icon;

            return (
              <div
                key={job._id}
                className={`border rounded-lg p-4 ${statusConfig.borderColor} ${statusConfig.bgColor}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon className={`h-5 w-5 ${statusConfig.color} mr-3`} />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {getJobTypeLabel(job.type)}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {getStatusLabel(job.status)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {new Date(job.createdAt).toLocaleString()}
                    </div>
                    {job.attempts > 0 && (
                      <div className="text-xs text-gray-400">
                        {t("attempt")} {job.attempts}/{job.maxAttempts}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {(job.status === "processing" || job.status === "retrying") && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>{t("progress")}</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {job.status === "failed" && job.error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">
                      <strong>{t("error")}:</strong> {job.error.message}
                    </p>
                    {job.error.code && (
                      <p className="text-xs text-red-600 mt-1">
                        {t("errorCode")}: {job.error.code}
                      </p>
                    )}
                  </div>
                )}

                {/* Completion Time */}
                {job.status === "completed" && job.completedAt && (
                  <div className="mt-3 text-sm text-gray-600">
                    {t("completedAt")}:{" "}
                    {new Date(job.completedAt).toLocaleString()}
                  </div>
                )}

                {/* Retry Information */}
                {job.status === "retrying" && (
                  <div className="mt-3 text-sm text-yellow-700">
                    {t("retryingIn")} {Math.pow(2, job.attempts)} {t("minutes")}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Job Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {jobs.filter((job) => job.status === "completed").length}
              </div>
              <div className="text-sm text-gray-500">{t("completed")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {jobs.filter((job) => job.status === "processing").length}
              </div>
              <div className="text-sm text-gray-500">{t("processing")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {jobs.filter((job) => job.status === "retrying").length}
              </div>
              <div className="text-sm text-gray-500">{t("retrying")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {jobs.filter((job) => job.status === "failed").length}
              </div>
              <div className="text-sm text-gray-500">{t("failed")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
