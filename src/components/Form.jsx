import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "./Button"
import CustomRadio from "./CustomRadio"
import { useForm } from "react-hook-form"
import * as z from "zod"
import FileInput from "./FileInput"
import FloatingInput from "./FloatingInput"
import isEmail from "validator/lib/isEmail"
import Preloader from "./Preloader"

// Zod validation schema
const schema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Name field can't be empty"
        })
        .max(60, {
            message: "The name cannot be longer than 60 characters"
        }),
    email: z
        .string()
        .refine((value) => isEmail(value, { allow_display_name: true }), {
            message: "Invalid email"
        }),
    phone: z
        .string()
        .trim()
        .min(1, {
            message: "Phone field can't be empty"
        })
        .regex(/^\+380\d{9}$/, {
            message: "Phone number must starts with +380 and must not    contain spaces"
        }),
    position_id: z
        .string(),
    photo: z
        .any()
        .refine(file => file, {
            message: "Photo is required"
        })
        .refine(file => ["image/jpeg", "image/jpg"].includes(file?.type), {
            message: "Only .jpeg or .jpg are allowed"
        })
        .refine(file => file?.size < 5000000, {
            message: "The photo may not be greater than 5 Mbytes"
        })
        .refine((file) =>
            // Return a promise which waits for the image to upload
            new Promise(resolve => {
                if (!file) return resolve(false)

                const img = new Image()
                img.src = URL.createObjectURL(file)

                img.onload = () => {
                    resolve(img.width >= 75 && img.height >= 75)
                    URL.revokeObjectURL(img.src)
                }

                img.onerror = () => resolve(false)
            })
            , {
                message: "The photo must be at least 75x75 pixels"
            })
})

export default function Form({ setSuccess, setCurrentPage, getUsers }) {
    // React Hook Form
    const {
        register,
        handleSubmit,
        reset,
        control,
        setError,
        formState: {
            errors,
            isDirty
        }
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            position_id: "",
            photo: null
        },
        resolver: zodResolver(schema)
    })

    // States
    const [positions, setPositions] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // Functions
    async function onSubmit(data) {
        try {
            // Get the token
            const tokenResponse = await fetch("https://frontend-test-assignment-api.abz.agency/api/v1/token", {
                method: "POST",
                headers: {
                    "accept": "application/json",
                },
                body: ""
            })

            if (!tokenResponse.ok) {
                console.log('token error');

                setError("root", {
                    type: "token",
                    message: `Failed to get authentication token: ${tokenResponse.status}`
                })
                return
            }

            const tokenData = await tokenResponse.json()
            const token = tokenData.token

            // Form Data
            const formData = new FormData()

            formData.append("name", data.name)
            formData.append("email", data.email)
            formData.append("phone", data.phone)
            formData.append("position_id", data.position_id)
            formData.append("photo", data.photo)

            // Register a new user
            const response = await fetch("https://frontend-test-assignment-api.abz.agency/api/v1/users", {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "Token": token,
                },
                body: formData,
            })

            if (!response.ok) {
                console.log('register error');

                const errorData = await response.json()
                console.error("Server error:", errorData)

                setError("root", {
                    type: "server",
                    message: errorData.message || `Server error: ${response.status}`
                })

                return
            }

            const result = await response.json()
            console.log(result)

            // Reset the form
            reset({
                name: "",
                email: "",
                phone: "",
                position_id: positions[0]?.id || "",
                photo: null
            })

            // Success
            setSuccess(true)

            // Reset users
            setCurrentPage(1)
            getUsers(1, true)

        } catch (error) {
            console.log(error)

            setError("root", {
                type: "network",
                message: "Network Error"
            })
        }
    }

    useEffect(() => {
        // Fetch a positions array
        setIsLoading(true)

        fetch("https://frontend-test-assignment-api.abz.agency/api/v1/positions")
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`)
                }

                return res.json()
            })
            .then(data => {
                // Update positions state with an array and update form defaultValues
                setPositions(data.positions)
                reset({
                    name: "",
                    email: "",
                    phone: "",
                    position_id: data.positions[0].id,
                    photo: null
                })
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsLoading(false)
            })
    }, [reset])

    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form__row">
                <FloatingInput
                    labelText="Your name"
                    register={register}
                    name="name"
                    className="form-input"
                    error={errors.name?.message}
                />
            </div>
            <div className="form__row">
                <FloatingInput
                    labelText="Email"
                    register={register}
                    name="email"
                    className="form-input"
                    error={errors.email?.message}
                />
            </div>
            <div className="form__row form__row--phone">
                <FloatingInput
                    labelText="Phone"
                    register={register}
                    name="phone"
                    className="form-input"
                    error={errors.phone?.message}
                />
            </div>
            <p className="form__text">Select your position</p>
            <div className="form__options">
                {isLoading ? (
                    <Preloader />
                ) : (
                    positions.map((pos, index) => {
                        // Check the fist radio
                        if (index === 0) {
                            return <CustomRadio
                                key={pos.id}
                                label={pos.name}
                                id={pos.id}
                                name="position_id"
                                register={register}
                                checked={true}
                            />
                        }

                        return <CustomRadio
                            key={pos.id}
                            label={pos.name}
                            id={pos.id}
                            name="position_id"
                            register={register}
                        />
                    })
                )}
            </div>
            <FileInput
                control={control}
                error={errors.photo?.message}
            />
            {errors.root ? <p className="form__error">{errors.root?.message}</p> : null}
            <Button type="yellow" disabled={!isDirty}>Sign up</Button>
        </form>
    )
}