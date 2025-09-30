import {
  useElements,
  useStripe,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { cancelSubscription } from "@/utils/apiUtils";
import { RootState } from "../../store/store"; // Import RootState type

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#000",
      "::placeholder": {
        color: "#a0aec0",
      },
      padding: "10px 12px", // Ensure padding is applied correctly
    },
    invalid: {
      color: "#e53e3e",
    },
  },
};

function CheckoutForm({
  priceId,
  callBack,
}: {
  priceId: string;
  callBack: (method: string, subscriptionId: string) => void;
}) {
  const user = useSelector((state: RootState) => state.user); // Use RootState for type safety
  const subscription = user?.subscription;
  const stripe = useStripe();
  const elements = useElements();

  const [cardError, setCardError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState("");

  const createSubscription = useCallback(async () => {
    if (!stripe || !elements) {
      alert("Stripe is not loaded correctly.");
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment method
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        alert("Card element is not loaded correctly.");
        setIsProcessing(false);
        return;
      }

      const { paymentMethod, error: paymentMethodError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name,
            email: user.email,
          },
        });

      if (paymentMethodError) {
        console.error(
          "Error creating Payment Method:",
          paymentMethodError.message
        );
        setCardError(paymentMethodError.message || "");
        setIsProcessing(false);
        return;
      }

      if (!paymentMethod || !paymentMethod.id) {
        console.error("Payment Method ID is missing.");
        alert("Payment Method creation failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      if (subscription && subscription.stripeSubscriptionId) {
        await cancelSubscription(true); // Cancel immediately
      }

      // Call backend to create subscription
      const response = await fetch(
        `https://api.wordtowallet.com/api/subscription/create-stripe-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethodId: paymentMethod.id,
            name,
            email: user.email,
            priceId,
          }),
        }
      );

      if (!response.ok) {
        alert("Failed to create subscription. Please try again.");
        setIsProcessing(false);

        return;
      }

      const { subscriptionId, error: serverError } = await response.json();

      if (serverError) {
        alert(serverError.message);
        setIsProcessing(false);
        return;
      }
      callBack("stripe", subscriptionId);
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
  }, [stripe, elements, name, user.email, subscription, priceId, callBack]);

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !isProcessing && stripe) {
        createSubscription();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isProcessing, stripe, createSubscription]);

  return (
    <div className="grid gap-4 m-auto">
      <div className="mb-2">
        {/* <label className="block mb-2 text-sm font-semibold text-gray-800">
          Card number
        </label> */}
        <div className="w-full p-3 border border-gray-300 rounded-md text-lg">
          <CardNumberElement options={cardElementOptions} />
        </div>
        {cardError && (
          <div className="text-red-500 mt-1 text-sm">{cardError}</div>
        )}
      </div>
      <div className="flex justify-between gap-4 mb-2">
        <div className="flex-1">
          {/* <label className="block mb-2 text-sm font-semibold text-gray-800">
            Expiration date
          </label> */}
          <div className="w-full p-3 border border-gray-300 rounded-md text-lg">
            <CardExpiryElement options={cardElementOptions} />
          </div>
        </div>
        <div className="flex-1">
          {/* <label className="block mb-2 text-sm font-semibold text-gray-800">
            CVC
          </label> */}
          <div className="w-full p-3 border border-gray-300 rounded-md text-lg">
            <CardCvcElement options={cardElementOptions} />
          </div>
        </div>
      </div>
      <div className="mb-2">
        {/* <label
          className="block mb-2 text-sm font-semibold text-gray-800"
          htmlFor="name"
        >
          Card Holder Name
        </label> */}
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-lg"
        />
      </div>
      <button
        onClick={createSubscription}
        disabled={!stripe || isProcessing}
        className="bg-[#4B68FF] text-white w-full py-2 rounded-lg font-semibold mt-6"
      >
        {isProcessing ? "Processing..." : "Pay and Download The File"}
      </button>
    </div>
  );
}

export default CheckoutForm;
