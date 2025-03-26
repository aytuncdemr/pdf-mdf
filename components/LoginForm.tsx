"use client";

import React, { useContext, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios, { isAxiosError } from "axios";
import { UserContext } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const validationSchema = Yup.object({
        userName: Yup.string().required("Kullanıcı adı gerekli"),
        password: Yup.string().required("Şifre gerekli"),
    });
    const [error, setError] = useState<string | null>(null);
    const userContext = useContext(UserContext);
    const router = useRouter();

    const [initialValues, setInitialValues] = useState({
        userName: "",
        password: "",
    });

    useEffect(() => {
        setInitialValues({
            userName: localStorage.getItem("userName") || "",
            password: localStorage.getItem("password") || "",
        });
    }, []);

    async function loginHandler(userName: string, password: string) {
        setError(null);
        try {
            const {
                data: { token },
            } = await axios.post("/api/mongodb/login", {
                userName,
                password,
            });

            userContext?.setUser({ token });
            localStorage.setItem("userName", userName);
            localStorage.setItem("password", password);
            router.push("/pdfs");
        } catch (error) {
            if (isAxiosError(error)) {
                setError(error.response?.data.message || error.message);
            } else if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                await loginHandler(values.userName, values.password);
                setSubmitting(false);
            }}
        >
            {({ isSubmitting }) => (
                <Form className="p-4 border  rounded-md  sm:w-[24rem]  mx-auto mt-10 ">
                    <div className="mb-3">
                        <label className="block font-bold text-lg mb-2">
                            Kullanıcı Adı
                        </label>
                        <Field
                            type="text"
                            name="userName"
                            className="border p-2 w-full rounded outline-none"
                        />
                        <ErrorMessage
                            name="userName"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold text-lg mb-2">
                            Şifre
                        </label>
                        <Field
                            type="password"
                            name="password"
                            className="border p-2 w-full rounded outline-none"
                        />
                        <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-lg text-center mb-2">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-amber-500 text-white px-4 py-2 rounded w-full hover:bg-amber-600 duration-150 cursor-pointer"
                    >
                        {isSubmitting ? "..." : "Giriş Yap"}
                    </button>
                </Form>
            )}
        </Formik>
    );
}
