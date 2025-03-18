import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

/**
 * Crea un nuevo objetivo de lectura en Firestore.
 */
export const createReadingGoal = async (userId: string, bookTitle: string, startDate: Date, author?: string, partnerId?: string) => {
    try {
        const docRef = await addDoc(collection(db, "reading_goals"), {
            userId,
            bookTitle,
            author: author || "", // Si no se proporciona autor, guardar un string vacío
            startDate: Timestamp.fromDate(startDate),
            partnerId: partnerId || null,
            progress: 0, // Inicialmente el avance es 0
            createdAt: Timestamp.now(),
        });

        console.log("Nuevo objetivo creado con ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error al crear objetivo de lectura:", error);
        throw error;
    }
};
