"use client";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { type postSchema } from "~/server/api/routers/post";
import { type z } from "zod";
import { TRPCClientError } from "@trpc/client";
import FormLabel from "./label";

interface TRPCErrorShape {
  code: string;
  httpStatus: number;
  path: string;
  stack?: string;
  zodError?: {
    formErrors: string[];
    fieldErrors: Record<string, string[]>;
  };
}

type PostSchemaType = z.infer<typeof postSchema>;
interface FormData {
  name: string;
  account: string;
  gender: string;
  age: string;
  area: string;
  likeMusic1: string;
  likeMusic2: string;
  likeMusic3: string;
  likeAdo: string;
  live: string;
  freeSpace: string;
}

export function LatestPost() {
  const utils = api.useUtils();
  const [formData, setFormData] = useState<PostSchemaType>({
    name: "",
    account: "",
    gender: "",
    age: "",
    area: "",
    likeMusic1: "",
    likeMusic2: "",
    likeMusic3: "",
    likeAdo: "",
    live: "",
    freeSpace: "",
  });
  const [errors, setErrors] = useState<PostSchemaType>({
    name: "",
    account: "",
    gender: "",
    age: "",
    area: "",
    likeMusic1: "",
    likeMusic2: "",
    likeMusic3: "",
    likeAdo: "",
    live: "",
    freeSpace: "",
  });
  useEffect(() => {
    const storedData = sessionStorage.getItem("formData");
    if (storedData) {
      const parsedData: FormData = JSON.parse(storedData) as FormData;
      setFormData(parsedData);
    }
  }, []);

  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      // フォーム送信成功後の処理（必要に応じて）
    },
    onError: (error) => {
      if (error instanceof TRPCClientError) {
        const errorData: TRPCErrorShape = error.data as TRPCErrorShape;
        setErrors({
          name: errorData.zodError?.fieldErrors.name?.[0] ?? "",
          account: errorData.zodError?.fieldErrors.account?.[0] ?? "",
          gender: errorData.zodError?.fieldErrors.gender?.[0] ?? "",
          age: errorData.zodError?.fieldErrors.age?.[0] ?? "",
          area: errorData.zodError?.fieldErrors.area?.[0] ?? "",
          likeMusic1: errorData.zodError?.fieldErrors.likeMusic1?.[0] ?? "",
          likeMusic2: errorData.zodError?.fieldErrors.likeMusic2?.[0] ?? "",
          likeMusic3: errorData.zodError?.fieldErrors.likeMusic3?.[0] ?? "",
          likeAdo: errorData.zodError?.fieldErrors.likeAdo?.[0] ?? "",
          live: errorData.zodError?.fieldErrors.live?.[0] ?? "",
          freeSpace: errorData.zodError?.fieldErrors.freeSpace?.[0] ?? "",
        });
      }
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    sessionStorage.setItem("formData", JSON.stringify(formData));
    createPost.mutate({
      name: formData.name,
      account: formData.account,
      gender: formData.gender,
      age: formData.age,
      area: formData.area,
      likeMusic1: formData.likeMusic1,
      likeMusic2: formData.likeMusic2,
      likeMusic3: formData.likeMusic3,
      likeAdo: formData.likeAdo,
      live: formData.live,
      freeSpace: formData.freeSpace,
    });
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <FormLabel label="お名前" required />
          <input
            type="text"
            name="name"
            placeholder="お名前"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 text-black"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        <div>
          <FormLabel label="X(Twitter) アカウント" required />
          <input
            type="text"
            name="account"
            placeholder="X(Twitter) アカウント"
            value={formData.account}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 text-black"
          />
          {errors.account && (
            <p className="text-sm text-red-500">{errors.account}</p>
          )}
        </div>
        <div>
          <FormLabel label="性別" />
          <input
            type="text"
            name="gender"
            placeholder="性別"
            value={formData.gender}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 text-black"
          />
          {errors.gender && (
            <p className="text-sm text-red-500">{errors.gender}</p>
          )}
        </div>
        <div>
          <FormLabel label="年齢" />
          <input
            type="text"
            name="age"
            placeholder="年齢"
            value={formData.age}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 text-black"
          />
          {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
        </div>
        <div>
          <FormLabel label="居住地" />
          <input
            type="text"
            name="area"
            placeholder="居住地"
            value={formData.area}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 text-black"
          />
          {errors.area && <p className="text-sm text-red-500">{errors.area}</p>}
        </div>
        <div>
          <FormLabel label="好きな曲第1位" required />
          <input
            type="text"
            name="likeMusic1"
            placeholder="好きな曲第1位"
            value={formData.likeMusic1}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 text-black"
          />
          {errors.likeMusic1 && (
            <p className="text-sm text-red-500">{errors.likeMusic1}</p>
          )}
        </div>
        <div>
          <FormLabel label="好きな曲第2位" required />
          <input
            type="text"
            name="likeMusic2"
            placeholder="好きな曲第2位"
            value={formData.likeMusic2}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 text-black"
          />
          {errors.likeMusic2 && (
            <p className="text-sm text-red-500">{errors.likeMusic2}</p>
          )}
        </div>
        <div>
          <FormLabel label="好きな曲第3位" required />
          <input
            type="text"
            name="likeMusic3"
            placeholder="好きな曲第3位"
            value={formData.likeMusic3}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 text-black"
          />
          {errors.likeMusic3 && (
            <p className="text-sm text-red-500">{errors.likeMusic3}</p>
          )}
        </div>
        <div>
          <FormLabel label="Adoの好きなところ" required />
          <input
            type="text"
            name="likeAdo"
            placeholder="Adoの好きなところ"
            value={formData.likeAdo}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 text-black"
          />
          {errors.likeAdo && (
            <p className="text-sm text-red-500">{errors.likeAdo}</p>
          )}
        </div>
        <div>
          <FormLabel label="参加したライブ・参加予定のライブ" />
          <input
            type="text"
            name="live"
            placeholder="参加したライブ・参加予定のライブ"
            value={formData.live}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 text-black"
          />
          {errors.live && <p className="text-sm text-red-500">{errors.live}</p>}
        </div>
        <div>
          <FormLabel label="自由記入欄" />
          <textarea
            name="freeSpace"
            placeholder="自由記入欄"
            value={formData.freeSpace}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 text-black"
            rows={3}
          />
          {errors.freeSpace && (
            <p className="text-sm text-red-500">{errors.freeSpace}</p>
          )}
        </div>

        <button
          type="submit"
          className="rounded bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
