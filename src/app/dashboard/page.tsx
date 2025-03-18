"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import NewGoalForm from "@/components/NewGoalForm"; // Asegúrate de que este archivo exista


const handleLogout = async () => {
  await signOut(auth);
  window.location.href = "/auth"; // 🔹 Redirigir después del logout
};

export default function Dashboard() {

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth"); // 🔹 Si no hay usuario, redirigir a /login
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }


  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-screen bg-stone-700">

      <h1 className="text-center text-lg md:text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight text-stone-200 font-bold ">🎉 Bienvenido a Reading Buddy, {user?.email} 🎉</h1>

      <div className="flex flex-col gap-4">
        <Button
          onClick={handleLogout}
          className="mt-4 bg-red-500 hover:bg-red-600">
          Cerrar sesión
        </Button>

        {/* Botón que abre el pop-up */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 text-white">📚 Nuevo objetivo de lectura</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo objetivo de lectura</DialogTitle>
            </DialogHeader>

            {/* Formulario dentro del modal */}
            <NewGoalForm />
          </DialogContent>
        </Dialog>
      </div>

    </div>
  );
}
