"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewGoalForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [startDate, setStartDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, author, startDate });
    // Aquí luego se guardará en Firestore
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Título del libro</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div>
        <Label>Autor</Label>
        <Input value={author} onChange={(e) => setAuthor(e.target.value)} required />
      </div>

      <div>
        <Label>Fecha de inicio</Label>
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      </div>

      <Button type="submit" className="w-full bg-stone-950">
        Guardar objetivo
      </Button>
    </form>
  );
}
