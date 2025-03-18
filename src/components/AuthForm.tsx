"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";  // 🔹 Importamos el router
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Definir el tipo correcto para la prop onRegister
interface AuthFormProps {
    onSubmit: (email: string, password: string, phone?: string) => void;
    onGoogleSignIn: () => void;
    isRegistering: boolean;
    setIsRegistering: (value: boolean) => void;
}

export default function AuthForm({ onSubmit, onGoogleSignIn, isRegistering, setIsRegistering }: AuthFormProps) {
    const router = useRouter(); // 🔹 Hook para redirigir
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState<string[]>([]); // 📌 Ahora almacenamos múltiples errores

    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };
    const validatePhone = (phone: string) => /^\+51\d{9}$/.test(phone); // 📌 Valida solo números de Perú

    // Proveedor de Google
    const provider = new GoogleAuthProvider();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let validationErrors: string[] = []; // 📌 Creamos un array para los errores

        if (!validateEmail(email)) {
            validationErrors.push("El correo electrónico no es válido.");
        }

        if (password.length < 6) {
            validationErrors.push("La contraseña debe tener al menos 6 caracteres.");
        }

        if (isRegistering && !validatePhone(phone)) {
            validationErrors.push("El número de teléfono debe ser peruano y tener el formato: +51XXXXXXXXX.");
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors); // 📌 Guardamos todos los errores en el estado
            return;
        }

        setErrors([]); // 📌 Si no hay errores, limpiamos el estado
        onSubmit(email, password, isRegistering ? phone : undefined);
    };

    return (
        <div className="bg-stone-700 flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {errors.length > 0 && (
                <div className="text-red-500 bg-red-100 p-2 rounded mb-4">
                    {errors.map((err, index) => (
                        <p key={index}>{err}</p>
                    ))}
                </div>
            )}

            <div className="p-8 bg-stone-400 rounded-xl shadow-md w-96">
                <h2 className="text-2xl font-semibold text-center mb-6">
                    {isRegistering ? "Registro" : "Iniciar Sesión"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 mb-4 border rounded"
                        />
                    </div>

                    <div>
                        <Label>Contraseña</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 mb-4 border rounded"
                        />
                    </div>

                    {isRegistering && (
                        <div>
                            <Label>Número de Teléfono</Label>
                            <Input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="w-full p-2 mb-4 border rounded"
                            />
                        </div>
                    )}

                    <Button type="submit" className="w-full">
                        {isRegistering ? "Registrarse" : "Iniciar Sesión"}
                    </Button>
                </form>

                <div className="text-center my-4">
                    <span className="text-sm">O</span>
                </div>

                <Button onClick={onGoogleSignIn} className="w-full bg-red-500 hover:bg-red-600">
                    Iniciar sesión con Google
                </Button>

                <p className="text-sm text-center mt-4">
                    {isRegistering ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
                    <span
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-blue-700 cursor-pointer">
                        {isRegistering ? "Inicia sesión aquí" : "Regístrate aquí"}
                    </span>
                </p>
            </div>
        </div>
    );
}
