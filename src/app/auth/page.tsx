"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "firebase/auth";
import AuthForm from "@/components/AuthForm";

export default function AuthPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null); // Nuevo estado para errores
  const [isRegistering, setIsRegistering] = useState(false); // Estado para alternar entre login y registro

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/dashboard");
    });
    return () => unsubscribe();
  }, [router]);

  // Mapeo de errores de Firebase a mensajes más claros
  const errorMessages: { [key: string]: string } = {
    "auth/email-already-in-use": "Este correo ya está registrado.",
    "auth/invalid-email": "El formato del correo no es válido.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/missing-phone-number": "Debes ingresar un número de teléfono.",
    "auth/user-not-found": "No existe una cuenta con este correo.",
    "auth/wrong-password": "La contraseña es incorrecta.",
    "auth/user-disabled": "Esta cuenta ha sido deshabilitada.",
    default: "Ocurrió un error, por favor intenta nuevamente.",
  };

  // 🔹 Manejo del login/registro con email y contraseña
  const onSubmit = async (email: string, password: string, phone?: string) => {
    setError(null); // Limpiar errores previos
    try {
      if (isRegistering) {
        if (!phone) throw new Error("auth/missing-phone-number");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardar el número de teléfono en Firestore
        await setDoc(doc(db, "users", user.uid), { email, phone, createdAt: new Date() });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      router.push("/dashboard"); // Redirigir después del login
    } catch (err: any) {
      setError(errorMessages[err.code] || errorMessages.default);
    }
  };

  // 🔹 Manejo del login con Google
  const onGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Guardar en Firestore si es nuevo usuario
      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          phone: "", // No tenemos el teléfono, podríamos solicitarlo después
          createdAt: new Date(),
        },
        { merge: true }
      );

      router.push("/dashboard");
    } catch (err: any) {
      setError(errorMessages[err.code] || errorMessages.default);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-700">
      {/* Pasa la función correctamente como prop */}
      {error && <p className="text-red-500 bg-red-100 p-2 rounded">{error}</p>}
      <AuthForm 
        onSubmit={onSubmit} 
        onGoogleSignIn={onGoogleSignIn} 
        isRegistering={isRegistering}
        setIsRegistering={setIsRegistering} // 🔹 Nueva prop
      />
    </div>
  );
}
