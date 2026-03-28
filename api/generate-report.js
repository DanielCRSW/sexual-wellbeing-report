export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = req.body;

    return res.status(200).json({
      message: "Data received",
      received: data
    });

  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
