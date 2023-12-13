"use client";

import AuthSocialButton from "@/app/components/AuthSocialButton";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";

import axios from "axios";

import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BsGithub, BsGoogle } from "react-icons/bs";

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";

type Variant = "LOGIN" | "REGISTER";

export default function AuthForm() {
  const session = useSession();
  const router = useRouter();

  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/users");
    }

    return () => {

    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (formData) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      axios.post('/api/register', formData)
      .then(() => {
        toast.success("Register Success.");
        signIn("credentials", formData);
      })
      .catch(() => toast.error("Something went wrong."))
      .finally(() => setIsLoading(false));
    }

    if (variant === "LOGIN") {
      signIn("credentials", {
        ...formData,
        redirect: false
      })
      .then((res) => {
        if (res?.error) {
          toast.error("Invalid credentials.");
        }

        if (res?.ok && !res?.error) {
          toast.success("Logged in.");
          router.push("/users");
        }
      })
      .finally(() => setIsLoading(false));
    }
  };

  const socialActions = (action: string) => {
    setIsLoading(true);

    signIn(action, {
      redirect: false
    })
    .then((res) => {
      if (res?.error) {
        toast.error("Invalid credentials.");
      }

      if (res?.ok && !res?.error) {
        toast.success("Logged in.");
      }
    })
    .finally(() => setIsLoading(false));
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input label="name" register={register} id="name" errors={errors} />
          )}
          <Input
            id="email"
            label="Email address"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialActions("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialActions("google")}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === "LOGIN"
              ? "New to Messenger?"
              : "Already have an account?"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
}
