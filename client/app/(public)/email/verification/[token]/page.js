"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/app/components/loading";
import Link from "next/link";

export default function Verification() {
  const router = useRouter();
  const { token } = useParams(); // get the token from the URL
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({ message: "", email: "" });

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(
          `http://localhost:3030/email/verification/${token}`
        );
        const data = await res.json();
        setStatus({
          message: data.message,
          email: data.email || "",
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return isLoading ? (
    <div className="flex items-center justify-center h-full">
      <Loading />
    </div>
  ) : (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        {status.message.includes("completed") ? (
          <>
            <h1 className="text-2xl font-bold text-success">Email Verified!</h1>
            <p className="mt-4">
              The email <strong>{status.email}</strong> has been successfully
              verified. Click{" "}
              <Link href="/login" className="text-primary underline">
                here
              </Link>{" "}
              to login
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-error">
              Oops! This verification link has expired or isn’t valid. No
              worries—just{" "}
              <Link href="/register" className="text-primary underline">
                register
              </Link>{" "}
              with the same email again. And and we’ll send you a verification
              link.
            </h1>
            <p className="mt-4">{status.message}</p>
          </>
        )}
        <Link href="/" className="btn btn-primary mt-6">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
