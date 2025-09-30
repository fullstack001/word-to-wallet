"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/slices/userSlice";
import { login } from "../../store/slices/authSlice";
import { RootState } from "../../store/store";
import { downloadFile } from "../../utils/apiUtils";
import { useLocalizedNavigation } from "../../utils/navigation";

import CheckoutForm from "./CheckoutForm";

interface SubscriptionData {
  email: string;
  plan: string;
  subscriptionId: string;
  subscriptionType: string;
}

interface ApiResponse {
  token: string;
  user: Record<string, unknown>;
  subscription: Record<string, unknown>;
}

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

export default function PaymentForm({
  plan,
  email,
}: {
  plan: { id: string; price: number; priceId: string };
  email: string;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { navigate } = useLocalizedNavigation();
  const [agreed, setAgreed] = useState(false); // State for checkbox

  const handlePurchaseSubscription = (
    subscriptionType: string,
    subscriptionId: string
  ): void => {
    if (!agreed) {
      alert("You must agree to the terms before proceeding.");
      return;
    }

    const subscriptionData: SubscriptionData = {
      email: email,
      plan: plan.id,
      subscriptionId,
      subscriptionType,
    };

    fetch(`https://api.wordtowallet.com/api/subscription/add-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriptionData),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: ApiResponse = await response.json();
        const { token, user, subscription } = data;
        dispatch(
          setUser({
            name: user.name as string,
            email: user.email as string,
            cardnumber: (user.cardnumber as string) || "", // Add cardnumber property
            id: user.id as string,
            avatar: (user.avatar as string) || "", // Add avatar property
            isAdmin: (user.isAdmin as boolean) || false, // Add isAdmin property
            subscription: subscription
              ? {
                  stripeSubscriptionId: subscription.subscriptionId as string,
                  plan: subscription.plan as string,
                  status: subscription.subscriptionType as string,
                  currentPeriodStart: subscription.subscribedDate as string,
                  currentPeriodEnd: subscription.expiryDate as string,
                }
              : null,
          })
        );
        dispatch(login());
        localStorage.setItem("authToken", token as string);

        // Redirect to files page after successful payment
        navigate("/files");
      })
      .catch(() => {
        console.log("network error");
      });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-xl">Total Due Amount</h2>
        <span className="font-semibold">$ {plan.price}</span>
      </div>

      <hr className="mb-4" />

      <div className="mb-4">
        <p className="font-semibold mb-2">Express checkout</p>
        <div className="flex gap-2">
          <button className="rounded">
            <Image
              src="/assets/images/paypal.png"
              width={200}
              height={80}
              alt="paypal"
            />
          </button>
          <button className="rounded">
            <Image
              src="/assets/images/apple-pay.png"
              width={200}
              height={80}
              alt="apple-pay"
            />
          </button>
          <button className="rounded">
            <Image
              src="/assets/images/gpay.png"
              width={200}
              height={80}
              alt="gpay"
            />
          </button>
        </div>
      </div>

      <div className="mt-6">
        <p className="font-semibold mb-4">Pay with card</p>
        <Elements stripe={stripePromise}>
          <CheckoutForm
            priceId={plan.priceId}
            callBack={handlePurchaseSubscription}
          />
        </Elements>

        {/* Secure Notice + Terms Agreement */}
        <div className="mt-6">
          <div className="flex justify-between items-center text-green-600 text-sm gap-2 my-3">
            <span>🔒 This is a secure 128-bit encrypted payment</span>
            <svg className="w-16 h-auto" viewBox="0 0 70 27">
              <g clipPath="url(#a1)">
                <path
                  clipRule="evenodd"
                  d="M26.98 6.256c.832 0 1.659.003 2.484.008l3.317 6.298V6.256h1.989v9.982l-2.187.003L28.97 9.15v7.09H26.98V6.255ZM57.204 8.682c.77 0 1.524.225 2.164.647.64.421 1.14 1.02 1.434 1.721.294.7.371 1.472.22 2.216a3.817 3.817 0 0 1-1.066 1.963 3.914 3.914 0 0 1-1.995 1.048 3.951 3.951 0 0 1-2.25-.219 3.882 3.882 0 0 1-1.747-1.413 3.793 3.793 0 0 1 .486-4.842 3.897 3.897 0 0 1 1.264-.83c.473-.193.979-.292 1.49-.291Zm0 1.93c.383 0 .757.112 1.075.322.317.21.565.507.711.855a1.877 1.877 0 0 1-.42 2.075 1.962 1.962 0 0 1-2.108.411 1.927 1.927 0 0 1-.868-.702 1.882 1.882 0 0 1 .243-2.404 1.935 1.935 0 0 1 1.367-.557ZM39.28 8.682c.77 0 1.523.226 2.163.647a3.848 3.848 0 0 1 1.434 1.722c.294.701.37 1.472.22 2.216a3.817 3.817 0 0 1-1.067 1.962c-.545.536-1.24.901-1.995 1.049a3.95 3.95 0 0 1-2.25-.22 3.882 3.882 0 0 1-1.747-1.413 3.793 3.793 0 0 1 .486-4.842 3.897 3.897 0 0 1 1.264-.83c.473-.193.98-.292 1.49-.291h.002Zm0 1.93c.383 0 .757.112 1.075.322.318.21.565.507.711.855a1.876 1.876 0 0 1-.42 2.075 1.962 1.962 0 0 1-2.108.411 1.927 1.927 0 0 1-.868-.702 1.882 1.882 0 0 1 .242-2.404 1.935 1.935 0 0 1 1.368-.557Z"
                  fill="#000"
                  fillRule="evenodd"
                ></path>
                <path
                  clipRule="evenodd"
                  d="M43.813 8.901v7.334h2.211v-3.459c0-.304.048-.495.149-.788.203-.586.545-1.088 1.143-1.426.306-.175.34-.172.677-.172h1.392v3.97c.072 2.182 2.347 2.238 4.008 1.793-.095-.487-.186-.974-.28-1.46-.95.216-1.627.278-1.627-.892V10.39h1.598V8.845h-1.54V6.776H49.78l-.506 2.069h-1.223a2.45 2.45 0 0 0-1.446.445c-.382.261-.68.636-.86 1.154a760.14 760.14 0 0 1-.643-1.517l-1.29-.026ZM61.65 8.867v7.407h2.096v-4.898c0-.687 1.678-1.298 2.378-.46.183.222.166.281.166.548v4.773h2.138v-5.101c0-.58-.283-1.146-.646-1.596-.529-.658-1.29-.954-2.387-.753-.743.134-1.332.554-2.02 1.232l-.446-1.134c-.425-.005-.855-.011-1.28-.02l.001.002Z"
                  fill="#000"
                  fillRule="evenodd"
                ></path>
                <path
                  d="M68.838 9.02h.256v-.172h-.684v.171h.255v.796h.175l-.002-.796Zm1.16-.172h-.251l-.148.762h-.003l-.152-.762h-.255v.968h.163v-.808h.003l.154.808h.17l.155-.808h.003v.808H70l-.001-.968Z"
                  fill="#000"
                ></path>
                <path
                  d="M11.724 26.722C5.261 26.722 0 21.544 0 15.178 0 8.812 5.262 3.634 11.724 3.634c6.463 0 11.725 5.18 11.725 11.544 0 6.363-5.26 11.544-11.725 11.544Zm0-19.435a8.09 8.09 0 0 0-5.08 1.794 7.868 7.868 0 0 0-2.772 4.56 7.782 7.782 0 0 0 .794 5.257 7.97 7.97 0 0 0 4.002 3.567 8.13 8.13 0 0 0 5.39.26 8.003 8.003 0 0 0 4.336-3.168 7.795 7.795 0 0 0-.998-9.96 7.99 7.99 0 0 0-2.6-1.713 8.09 8.09 0 0 0-3.07-.597h-.002ZM25.407 1.857h-.915v.898h.915v-.898ZM25.407.063h-.915v.9h.915v-.9ZM22.78 2.746h-.854v.878h.855v-.878Z"
                  fill="#F7B512"
                ></path>
                <path
                  d="M21.095 4.474h-.86v.841h.86v-.841ZM23.735 3.628h-.958v.847h.958v-.847ZM20.229 3.67h-.858v.805h.858V3.67Z"
                  fill="#000"
                ></path>
                <path
                  d="M22.78 4.474h-.854v.841h.855v-.841ZM24.497.963h-.903v.895h.903V.963Z"
                  fill="#000"
                ></path>
                <path
                  d="M23.595 1.857h-1.67v.893h1.67v-.893Z"
                  fill="#000"
                ></path>
                <path
                  d="M21.925 2.746h-.831v1.725h.831V2.746ZM21.094 5.318v.847h-.862v-.847h-1.43v.61h-.765v.752h.854v.838h-.854V6.68h-.906v1.317h-.861v.838h-.572v.844h-.626c-.705 1.03-2.47 4.244-3.004 5.555-1.923-2.637-3.415-3.68-4.59-4.058-.638-.188-1.4.493-.346 1.562 2.419 2.62 3.181 4.79 3.916 6.52.389.912 2.135 1.053 2.487.126.743-1.967 1.823-4.173 3.101-5.987v-.934h.683v-.847h.718v-.982h.857V9.69h-.866v-.861h.866v.86h.85l-.002-.852h.683V7.809h.763v-.707h.737V5.318h-.831Z"
                  fill="#000"
                ></path>
                <path
                  d="m36.69 23.063-.24.377c.233.174.493.31.771.403.32.106.655.159.992.157.588 0 1.049-.143 1.36-.394.32-.259.49-.633.49-1.078 0-.475-.18-.799-.468-1.046-.294-.251-.709-.43-1.169-.6-.425-.152-.717-.287-.912-.45a.791.791 0 0 1-.297-.653c0-.276.08-.492.269-.65.188-.157.463-.236.871-.236a2.654 2.654 0 0 1 1.284.32l.191-.412a2.806 2.806 0 0 0-.571-.236 3.329 3.329 0 0 0-.926-.112c-.546 0-.955.132-1.23.354-.294.237-.44.58-.44.974 0 .46.16.774.425 1.013.265.239.646.414 1.066.577.41.158.732.293.955.467.237.186.363.41.363.746 0 .31-.12.552-.34.715-.22.163-.529.251-.909.251a2.537 2.537 0 0 1-.935-.172 3.1 3.1 0 0 1-.595-.312l-.005-.003ZM40.418 20.07h.595l1.072 3.419 1.026-3.42h.578l-1.395 4.334c-.223.706-.603 1.08-1.319 1.08a1.511 1.511 0 0 1-.434-.072l.071-.428c.107.022.215.036.323.04.483 0 .766-.285.904-.747l-1.421-4.207ZM48.588 19.996c.8 0 1 .659 1 1.298v2.738h-.58v-2.727c0-.422-.065-.819-.597-.819-.363 0-.74.223-1.12.605v2.944h-.58v-2.73c0-.422-.064-.819-.596-.819-.372 0-.757.257-1.12.614v2.935h-.58v-3.969h.33l.17.65c.373-.388.83-.72 1.379-.72.526 0 .751.284.911.698.38-.405.863-.698 1.386-.698h-.003ZM52.886 21.932c-.878.168-1.459.35-1.675.62-.106.125-.138.244-.138.427 0 .405.2.65.683.65.46 0 .855-.236 1.13-.445v-1.252Zm0-.58c0-.58-.178-.875-.815-.875-.412 0-.78.168-1.144.358l-.217-.389c.378-.253.812-.45 1.41-.45.977 0 1.346.532 1.346 1.396v2.642h-.33s-.17-.484-.177-.484c-.282.279-.734.549-1.257.549-.7 0-1.218-.436-1.218-1.088 0-.437.178-.747.563-.969.372-.213 1.04-.371 1.839-.492v-.197ZM54.758 20.066h.331l.17.676c.372-.414.846-.746 1.458-.746.857 0 1.08.659 1.08 1.298v2.738h-.577v-2.727c0-.422-.1-.819-.677-.819-.412 0-.84.257-1.203.636v2.913h-.58l-.002-3.969ZM58.602 20.475v-.411h.623l.17-1.134h.395v1.134h.903v.41h-.903v2.581c0 .383.066.597.451.597.17 0 .283-.031.468-.084l.085.397c-.182.084-.38.128-.58.13-.709 0-1.006-.35-1.006-1.002v-2.618h-.606ZM63.862 21.796c-.031-.904-.337-1.365-.943-1.365-.546 0-.926.427-.974 1.364h1.917Zm-.845 1.842c.467 0 .76-.168 1.105-.397l.249.332c-.386.326-.74.526-1.403.526-1.006 0-1.644-.795-1.644-2.049 0-1.23.63-2.054 1.59-2.054.978 0 1.546.712 1.546 2.085v.126h-2.524c.04.929.354 1.43 1.08 1.43ZM65.168 22.081c0-.973.403-2.085 1.637-2.085.515 0 .904.14 1.234.41l-.24.384a1.648 1.648 0 0 0-.993-.335c-.92 0-1.023.96-1.023 1.635 0 .636.128 1.549 1.055 1.549.429 0 .726-.158 1-.397l.275.327c-.275.284-.695.531-1.307.531-1.2 0-1.637-1.064-1.637-2.017l-.001-.002ZM30.773 20.07h.596l1.071 3.419 1.028-3.42h.578l-1.395 4.334c-.223.706-.603 1.08-1.318 1.08a1.511 1.511 0 0 1-.434-.072l.07-.428c.107.022.215.036.324.04.483 0 .765-.285.903-.747l-1.423-4.207ZM29.68 21.618c.012.081.017.167.023.247.006.08.009.172.009.252 0 .053-.003.104-.006.154a2.29 2.29 0 0 1-.011.147c-.006.047-.015.096-.023.143a1.58 1.58 0 0 1-.072.265.854.854 0 0 1-.048.118 1.071 1.071 0 0 1-.054.11c-.023.036-.043.07-.066.101h-.004a.86.86 0 0 1-.157.174.83.83 0 0 1-.191.126.889.889 0 0 1-.106.048 1.428 1.428 0 0 1-.24.05.994.994 0 0 1-.132.01l-.09-.003c-.032 0-.058-.006-.086-.011l-.08-.017-.063-.017-.005-.003-.009-.003c-.026-.008-.051-.02-.074-.028a.664.664 0 0 1-.072-.03.296.296 0 0 1-.066-.035c-.023-.011-.042-.022-.063-.034v-.002h-.002c-.02-.012-.038-.026-.058-.037a.66.66 0 0 0-.054-.04l-.051-.041c-.014-.014-.032-.028-.046-.045l-.042-.042a.474.474 0 0 0-.037-.04.46.46 0 0 0-.035-.039.355.355 0 0 1-.028-.04l-.003-.002-.003-.003v-2.06l.003-.003.005-.005a.96.96 0 0 1 .1-.088c.035-.028.069-.053.106-.078l.003-.003c.036-.025.073-.047.111-.068a1.225 1.225 0 0 1 .38-.152c.046-.011.09-.016.135-.022.045-.006.094-.006.14-.006a1.051 1.051 0 0 1 .277.034.588.588 0 0 1 .095.025c.031.009.062.02.091.034.029.014.06.031.089.048.03.017.058.037.085.059.028.023.057.045.085.07.028.025.051.056.077.087a.899.899 0 0 1 .135.214c.02.041.038.083.054.126.019.05.033.1.042.152.012.062.023.132.032.205v-.002Zm.578.92a3.505 3.505 0 0 0 .034-.47c0-.067-.003-.143-.006-.221a2.889 2.889 0 0 0-.017-.226c-.008-.073-.011-.135-.023-.194a1.126 1.126 0 0 0-.028-.143 1.492 1.492 0 0 0-.038-.135c-.014-.043-.031-.084-.045-.126-.014-.042-.035-.079-.052-.115a.91.91 0 0 0-.06-.104 1.1 1.1 0 0 0-.13-.186 1.733 1.733 0 0 0-.149-.152c-.026-.023-.055-.042-.08-.065l-.084-.056a.7.7 0 0 0-.084-.05 1.25 1.25 0 0 0-.086-.046.814.814 0 0 0-.174-.07c-.028-.011-.056-.02-.084-.029-.028-.008-.06-.013-.089-.02l-.088-.013a.906.906 0 0 0-.163-.017h-.08a1.43 1.43 0 0 0-.315.028 1.157 1.157 0 0 0-.274.084 1.39 1.39 0 0 0-.128.06 1.75 1.75 0 0 0-.117.073c-.037.025-.074.056-.108.084-.037.03-.071.063-.103.098l-.003.003-.003.003h-.046v-2.094h-.557v5.477h.414l.123-.389.003-.008v-.008h.043l.003.005.002.006a.172.172 0 0 0 .02.025l.023.031.006.009c.009.008.014.017.023.025a.524.524 0 0 0 .074.081l.046.04.051.041.057.04h.003c.02.011.04.025.063.036a.53.53 0 0 0 .072.037l.08.034c.023.008.048.02.074.028l.012.003.091.025.097.017c.034.005.071.008.106.011.034.003.074.003.114.003.052 0 .103-.003.155-.006.051-.003.1-.014.15-.022a1.337 1.337 0 0 0 .29-.087h.005c.095-.04.186-.09.272-.146l.127-.096c.043-.034.077-.074.117-.113l.003-.003a2.054 2.054 0 0 0 .2-.27c.032-.05.058-.103.086-.16.028-.056.051-.112.074-.174a2.137 2.137 0 0 0 .102-.4l-.001.008Z"
                  fill="#989898"
                ></path>
              </g>
              <defs>
                <clipPath id="a1">
                  <path d="M0 .063h70v26.659H0z" fill="#fff"></path>
                </clipPath>
              </defs>
            </svg>
          </div>

          <div className="text-sm text-gray-600 flex items-start gap-2 my-3">
            <input
              type="checkbox"
              id="agree"
              className="mt-1"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
            />
            <label htmlFor="agree">
              By checking this box, you agree to the{" "}
              <a
                href="/terms"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Use & Service
              </a>
              ,{" "}
              <a
                href="/privacy"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              , and confirm that if you do not cancel at least 24 hours before
              the end of the 7-day trial for CAD$1.95, you will be charged
              CAD$49 per 28 days until you cancel your subscription by
              contacting our customer support team via email at{" "}
              <a
                href="mailto:billing@pdfhouse.com"
                className="text-blue-600 underline"
              >
                billing@pdfhouse.com
              </a>
              . Payments will be charged from the card you specified above.
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
