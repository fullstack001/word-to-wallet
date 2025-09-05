import Image from "next/image";

const featureLeft = [
  {
    label: "Fill in, edit & Dave your PDFs",
    icon: "/assets/images/fill-in-edit-save-pdfs.png",
  },
  {
    label: "Comment, highlight & underline text",
    icon: "/assets/images/comment-highlight-underline-text.png",
  },
  {
    label: "Access your documents from any device",
    icon: "/assets/images/document-from-any-device.png",
  },
];

const featureRight = [
  {
    label: "Sign your docs online",
    icon: "/assets/images/sign-docs-online.png",
  },
  {
    label: "Use form templates",
    icon: "/assets/images/use-form-templates.png",
  },
  {
    label: "Add new fillable fields",
    icon: "/assets/images/add-new-fillable-fields.png",
  },
  {
    label: "Create your own forms",
    icon: "/assets/images/create-your-own-forms.png",
  },
];

interface PlanFeaturesProps {
  selectedPlan: string | null;
}

export default function PlanFeatures({ selectedPlan }: PlanFeaturesProps) {
  return (
    <div className="text-[18px] text-gray-700 space-y-6 my-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
        <div className="flex flex-col justify-start ">
          {featureLeft.map((feature, i) => (
            <div
              key={i}
              className="flex justify-start items-center py-2 cursor-pointer"
            >
              <div>
                <Image
                  src={feature.icon}
                  alt={feature.label}
                  width={50}
                  height={0}
                  style={{ height: "auto" }}
                  className="mx-auto mb-4"
                />
              </div>

              <div className="font-light text-[18px]">{feature.label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-start">
          {featureRight.map((feature, i) => (
            <div
              key={i}
              className={`flex justify-start items-center gap-2 py-1 cursor-pointer`}
            >
              <div>
                <Image
                  src={feature.icon}
                  alt={feature.label}
                  width={40}
                  height={0}
                  style={{ height: "auto" }}
                  className={`mx-auto mb-4 ${
                    selectedPlan === "7_free" ? "opacity-30" : ""
                  }`}
                />
              </div>

              <div
                className={`font-light text-[18px] ${
                  selectedPlan === "7_free" ? "opacity-30 line-through" : ""
                }`}
              >
                {feature.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[16px] font-light text-center text-gray-700 mt-8">
        After 7 days, the price is $39 with auto-renewal. Billed every 4 weeks.
        <br />
        Cancel anytime.{" "}
        <span className="font-semibold"> 30-day money-back guarantee. </span>
      </p>
    </div>
  );
}
