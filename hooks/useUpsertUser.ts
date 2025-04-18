import { User } from "@/types/User";
import { useMutation } from "@tanstack/react-query";

export default function useUpsertUser() {
  const upsertUser = useMutation<User, Error, string>({
    mutationFn: async (clerkId: string) => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/user/upsert`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clerkId,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        return res.json() as Promise<User>;
      } catch (error) {
        console.error("Error upserting user:", error);
        throw error;
      }
    },
  });

  return upsertUser;
}
