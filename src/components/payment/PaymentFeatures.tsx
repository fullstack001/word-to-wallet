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

export default function PaymentFeatures({
  selectedPlan,
}: {
  selectedPlan: string | null;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow text-sm">
      {featureLeft.map((feature, i) => (
        <div key={i} className="flex justify-start gap-2 cursor-pointer ">
          <div className="w-[40px]">
            <Image
              src={feature.icon}
              alt={feature.label}
              width={40}
              height={30}
              className="mx-auto "
            />
          </div>

          <div
            style={{ width: "calc(100% - 40px)" }}
            className="font-thin text-[16px] flex items-center"
          >
            {feature.label}
          </div>
        </div>
      ))}
      {selectedPlan !== "7_free" && (
        <div className="flex flex-col justify-start">
          {featureRight.map((feature, i) => (
            <div
              key={i}
              className={`flex justify-start items-center gap-2  cursor-pointer`}
            >
              <div>
                <Image
                  src={feature.icon}
                  alt={feature.label}
                  width={40}
                  height={30}
                  className={`mx-auto  ${
                    selectedPlan === "7_free" ? "opacity-30" : ""
                  }`}
                />
              </div>

              <div
                className={`font-light text-[16px] ${
                  selectedPlan === "7_free" ? "opacity-30 line-through" : ""
                }`}
              >
                {feature.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
