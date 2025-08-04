// Example update-profile API logic
import { getServerSession } from "next-auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).end();

  const session = await getServerSession(req);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  await connectDB();

  const { name, avatar } = req.body;

  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { name, avatar },
    { new: true }
  );

  res.status(200).json({ user });
}
