"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";

export default function MessageForm() {
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const handleUploadImg = (result: any) => {
    axios.post("/api/messages", {
      image: result?.info?.secure_url,
      conversationId
    })
  };

  const onSubmit: SubmitHandler<FieldValues> = (formData) => {
    setValue("message", "", { shouldValidate: true });

    axios.post("/api/messages", {
      ...formData,
      conversationId,
    })
    .catch(err => console.log(err));
  };

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUploadImg}
        uploadPreset="vcshdcfe"
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          type="text"
          id="message"
          register={register}
          errors={errors}
          placeholder="Write a message"
          required
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
}
