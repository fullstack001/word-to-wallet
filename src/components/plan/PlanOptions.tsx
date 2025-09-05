import { Star } from "lucide-react";

const plans = [
  { id: "7_free", title: "7-Day Basic Access", price: "$0.95", popular: false },
  { id: "7_full", title: "7-Day Full Access", price: "$1.95", popular: true },
  {
    id: "annual",
    title: "Annual Plan",
    price: "$16.58 /month",
    popular: false,
  },
];

interface PlanOptionsProps {
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
}

export default function PlanOptions({
  selectedOption,
  setSelectedOption,
}: PlanOptionsProps) {
  return (
    <div className="flex-1 space-y-4 w-full mb-6 md:mb-8">
      {plans.map((plan) => (
        <div
          key={plan.title}
          onClick={() => setSelectedOption(plan.id)}
          className={`rounded-2xl w-full border relative mb-4 overflow-hidden transition-all cursor-pointer ${
            selectedOption === plan.id
              ? "border-blue-500 bg-white shadow-md ring-2 ring-blue-500"
              : "border-gray-200 bg-white"
          }`}
        >
          {plan.popular && (
            <div className="bg-primary-900 text-white text-sm md:text-base px-3 md:px-4 py-2 font-semibold flex justify-center gap-2 md:gap-4 z-10 text-center">
              <Star size={12} className="fill-white mt-1" /> MOST POPULAR{" "}
              <Star size={12} className="fill-white mt-1" />
            </div>
          )}
          <div className="flex sm:flex-row justify-between items-start sm:items-center p-3 md:p-4 gap-3 sm:gap-0">
            <div className="flex-1">
              <p className="font-semibold text-lg md:text-xl lg:text-2xl mb-1  text-gray-800">
                {plan.title}
              </p>
              {/* <p className="text-xs md:text-sm text-gray-800 font-semibold">
                For occasional users
              </p> */}
            </div>
            <p className="font-semibold text-lg md:text-xl lg:text-2xl text-gray-800">
              {plan.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
